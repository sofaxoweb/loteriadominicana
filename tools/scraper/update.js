/* LotoGana scraper — aplica sorteos verificados a assets/data.js.
   Reemplaza SOLO el span `draws: [...]` de cada juego (búsqueda por
   llaves con conteo, respetando strings). Valida el resultado antes
   de escribir: si el JS queda inválido, no se escribe nada. */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const DATA = path.join(__dirname, "..", "..", "assets", "data.js");
const BUILD = path.join(__dirname, "..", "build.js");
const MAX_HISTORY = 30;

function loadModel(src) {
  return new Function(src + "\nreturn {SITE, LOTERIAS, AMERICANAS, SUENOS};")();
}

/* Encuentra el slice de texto de una lotería (o de AMERICANAS). */
function constSlice(src, constName, keyRe) {
  const cRe = new RegExp(`const ${constName} = \\[`);
  const cM = cRe.exec(src);
  if (!cM) return null;
  const cStart = cM.index;
  const kRe = new RegExp(keyRe);
  kRe.lastIndex = cStart;
  const kM = kRe.exec(src);
  if (!kM) return null;
  // fin del slice: siguiente entrada del mismo nivel o cierre del const
  const nextRe = /\n  \{\s*\n    (?:id|name):\s*"/g;
  nextRe.lastIndex = kM.index + 1;
  const nM = nextRe.exec(src);
  const end = nM ? nM.index : src.length;
  return { start: kM.index, end };
}

/* Dentro de un slice, encuentra el span [ ... ] del array draws:. */
function drawsSpan(src, slice) {
  const di = src.indexOf("draws:", slice.start);
  if (di < 0 || di > slice.end) return null;
  const open = src.indexOf("[", di);
  if (open < 0 || open > slice.end) return null;
  let depth = 0, inStr = null;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) return { start: open, end: i + 1 }; }
  }
  return null;
}

function serDraw(dr) {
  let s = `{ d: "${dr.d}", n: [${dr.n.map(x => `"${x}"`).join(",")}]`;
  if (dr.bonus) s += `, bonus: "${dr.bonus}"`;
  if (dr.super) s += `, super: "${dr.super}"`;
  return s + " }";
}

function findGame(model, gameId) {
  if (gameId.startsWith("americanas/")) {
    const name = gameId.slice("americanas/".length);
    const g = model.AMERICANAS.find(x => x.name === name);
    return g ? { game: g, sliceKey: `name:\\s*"${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, constName: "AMERICANAS" } : null;
  }
  const [lotId, gid] = gameId.split("/");
  const lot = model.LOTERIAS.find(l => l.id === lotId);
  if (!lot) return null;
  const game = lot.games.find(g => g.id === gid);
  if (!game) return null;
  return { game, sliceKey: `id:\\s*"${lotId}"`, gameKey: `id:\\s*"${gid}"`, constName: "LOTERIAS" };
}

/* updates: [{gameId, d, n, bonus?, super?}] → {applied, skipped} */
function applyUpdates(updates) {
  let src = fs.readFileSync(DATA, "utf8");
  const model = loadModel(src);
  const applied = [], skipped = [];

  for (const u of updates) {
    const found = findGame(model, u.gameId);
    if (!found) { skipped.push({ gameId: u.gameId, reason: "juego no existe en data.js" }); continue; }

    const cur = found.game.draws[0];
    const sameNums = (a, b) => (a || []).join(",") === (b || []).join(",");
    if (cur && cur.d === u.d && sameNums(cur.n, u.n) &&
        (cur.bonus || null) === (u.bonus || null) && (cur.super || null) === (u.super || null)) {
      skipped.push({ gameId: u.gameId, reason: "ya actualizado" });
      continue;
    }

    // localizar slice del juego
    let slice;
    if (found.constName === "AMERICANAS") {
      slice = constSlice(src, "AMERICANAS", found.sliceKey);
    } else {
      const lotSlice = constSlice(src, "LOTERIAS", found.sliceKey);
      if (!lotSlice) { skipped.push({ gameId: u.gameId, reason: "lotería no encontrada" }); continue; }
      const gRe = new RegExp(found.gameKey);
      const sub = src.slice(lotSlice.start, lotSlice.end);
      const gM = gRe.exec(sub);
      if (!gM) { skipped.push({ gameId: u.gameId, reason: "juego no encontrado" }); continue; }
      slice = { start: lotSlice.start + gM.index, end: lotSlice.end };
    }
    if (!slice) { skipped.push({ gameId: u.gameId, reason: "slice no encontrado" }); continue; }

    const span = drawsSpan(src, slice);
    if (!span) { skipped.push({ gameId: u.gameId, reason: "draws no encontrado" }); continue; }

    const newDraw = { d: u.d, n: u.n };
    if (u.bonus) newDraw.bonus = u.bonus;
    if (u.super) newDraw.super = u.super;
    const draws = [newDraw, ...found.game.draws].slice(0, MAX_HISTORY);
    const newSpan = "[ " + draws.map(serDraw).join(", ") + " ]";

    src = src.slice(0, span.start) + newSpan + src.slice(span.end);
    // actualizar el modelo en memoria para siguientes comparaciones
    found.game.draws = draws;
    applied.push({ gameId: u.gameId, d: u.d, n: u.n });
  }

  if (!applied.length) return { applied, skipped, changed: false };

  // bump SITE.updated a hoy
  const today = new Date().toISOString().slice(0, 10);
  src = src.replace(/updated: "\d{4}-\d{2}-\d{2}"/, `updated: "${today}"`);

  // validar antes de escribir
  try {
    loadModel(src);
  } catch (e) {
    throw new Error("data.js quedaría inválido, no se escribe: " + e.message);
  }
  fs.writeFileSync(DATA + ".tmp", src);
  try { new Function(fs.readFileSync(DATA + ".tmp", "utf8") + "\nreturn 1;")(); }
  catch (e) { fs.unlinkSync(DATA + ".tmp"); throw new Error("validación final falló: " + e.message); }
  fs.renameSync(DATA + ".tmp", DATA);

  // regenerar páginas
  execSync(`node ${JSON.stringify(BUILD)}`, { stdio: "pipe" });
  return { applied, skipped, changed: true };
}

module.exports = { applyUpdates, loadModel };
