/* LotoGana scraper — tests. Uso: node tools/scraper/test.js */
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { parseA } = require("./parseA");
const { parseB } = require("./parseB");
const { titleToGame, logoToGame } = require("./mapping");
const { canon, sameDraw, verify } = require("./verify");

const FX = path.join(__dirname, "fixtures");
const read = f => fs.readFileSync(path.join(FX, f), "utf8");
let n = 0;
const ok = name => { n++; console.log("  ok:", name); };

/* ---------- parseA ---------- */
{
  const games = parseA(read("a-home.html"));
  assert.strictEqual(games.length, 3, "3 bloques A");
  const gm = games.find(g => g.gameId === "nacional/gana-mas");
  assert.ok(gm, "gana-mas mapeado");
  assert.strictEqual(gm.dateISO, "2026-10-11");
  assert.deepStrictEqual(gm.balls.map(b => b.n), ["10", "35", "35"], "duplicados preservados");
  const loto = games.find(g => g.gameId === "leidsa/loto");
  assert.ok(loto.balls.find(b => b.n === "01" && b.special === "-green"), "bonus especial A");
  assert.ok(loto.balls.find(b => b.n === "07" && b.special === "-yellow"), "super especial A");
  assert.ok(loto.jackpot && loto.jackpot.includes("150,000,000"), "jackpot extraído");
  ok("parseA: títulos, fechas, bolos, especiales, jackpot");
}

/* ---------- parseB ---------- */
{
  const games = parseB({
    "https://www.sorteosrd.com/sorteosleidsa": read("b-sorteosleidsa.html"),
    "https://www.sorteosrd.com/realsorteos": read("b-realsorteos.html"),
    "https://www.sorteosrd.com/nacionalsorteos": read("b-nacionalsorteos.html"),
  });
  assert.strictEqual(games.length, 4, "4 bloques B");
  const pool = games.find(g => g.gameId === "leidsa/loto-pool");
  assert.deepStrictEqual(pool.balls.map(b => b.n), ["05", "30", "18", "13", "03"], "orden original B");
  assert.strictEqual(pool.dateISO, "2026-10-11");
  const loto = games.find(g => g.gameId === "leidsa/loto");
  assert.ok(loto.balls.find(b => b.n === "01" && b.special === "azul"), "boloazul=bonus");
  assert.ok(loto.balls.find(b => b.n === "07" && b.special === "rojo"), "bolorojo=super");
  const fecha = games.find(g => g.gameId === "real/tu-fecha");
  assert.strictEqual(fecha.balls.length, 1, "single ball");
  ok("parseB: logos, fechas, bolos, azul/rojo");
}

/* ---------- mapping robusto ---------- */
{
  assert.strictEqual(titleToGame("Juego Que No Existe XYZ"), null);
  assert.strictEqual(logoToGame("logoraro123"), null);
  assert.strictEqual(titleToGame("  LOTO POOL  "), "leidsa/loto-pool", "normaliza espacios/caso");
  ok("mapping: desconocidos → null sin romper");
}

/* ---------- canon + sameDraw ---------- */
{
  const a = canon({ gameId: "leidsa/loto-pool", dateISO: "2026-10-11", balls: [{ n: "03", special: "" }, { n: "05", special: "" }, { n: "13", special: "" }, { n: "18", special: "" }, { n: "30", special: "" }] });
  const b = canon({ gameId: "leidsa/loto-pool", dateISO: "2026-10-11", balls: [{ n: "05", special: "" }, { n: "30", special: "" }, { n: "18", special: "" }, { n: "13", special: "" }, { n: "03", special: "" }] });
  assert.ok(sameDraw(a, b), "orden distinto de bolos igual matcha");
  const c = canon({ gameId: "x", dateISO: "2026-10-11", balls: [{ n: "10", special: "" }, { n: "35", special: "" }, { n: "35", special: "" }] });
  const d = canon({ gameId: "x", dateISO: "2026-10-11", balls: [{ n: "35", special: "" }, { n: "10", special: "" }, { n: "35", special: "" }] });
  assert.ok(sameDraw(c, d), "duplicados matchean");
  const e = { ...a, date: "2026-10-10" };
  assert.ok(!sameDraw(a, e), "fecha distinta no matcha");
  ok("canon/sameDraw: orden, duplicados, fechas");
}

/* ---------- verify ---------- */
{
  const A = parseA(read("a-home.html"));
  const B = parseB({ "u1": read("b-sorteosleidsa.html"), "u2": read("b-realsorteos.html"), "u3": read("b-nacionalsorteos.html") });
  const v = verify(A, B);
  const ids = v.verified.map(x => x.gameId);
  assert.ok(ids.includes("leidsa/loto-pool"), "loto-pool verificado (orden distinto)");
  assert.ok(ids.includes("leidsa/loto"), "loto verificado con bonus/super");
  assert.ok(v.single.find(x => x.gameId === "nacional/gana-mas"), "gana-mas single (solo en A)");
  assert.ok(v.single.find(x => x.gameId === "real/tu-fecha"), "tu-fecha single (solo en B)");
  assert.strictEqual(v.conflicts.length, 0, "sin conflictos en fixtures");

  // caso conflicto: alterar un número en B
  const B2 = parseB({ "u1": read("b-sorteosleidsa.html").replace(">05</span>", ">06</span>") });
  const v2 = verify(A, B2);
  assert.ok(v2.conflicts.find(c => c.gameId === "leidsa/loto-pool"), "mismatch detectado");
  assert.ok(!v2.verified.find(x => x.gameId === "leidsa/loto-pool"), "mismatch no verificado");
  ok("verify: verified/single/conflict");
}

/* ---------- update (sobre copia) ---------- */
{
  const os = require("os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lg-"));
  const dataSrc = path.join(__dirname, "..", "..", "assets", "data.js");
  const dataCopy = path.join(tmp, "data.js");
  fs.copyFileSync(dataSrc, dataCopy);

  // monkey-patch DATA path via módulo: reescribimos require cache no es trivial;
  // en su lugar copiamos update.js lógica: usamos applyUpdates con DATA override
  // → más simple: test directo de findGame+spans con una copia temporal del módulo
  const updSrc = fs.readFileSync(path.join(__dirname, "update.js"), "utf8")
    .replace(/const DATA = .*;/, `const DATA = ${JSON.stringify(dataCopy)};`)
    .replace(/const BUILD = .*;/, `const BUILD = ${JSON.stringify(path.join(__dirname, "..", "build.js"))};`);
  const updPath = path.join(tmp, "update.js");
  fs.writeFileSync(updPath, updSrc);
  const { applyUpdates } = require(updPath);

  // 1. aplicar sorteo nuevo a pega-4-real (draws vacío)
  let r = applyUpdates([{ gameId: "real/pega-4-real", d: "2026-10-11", n: ["11", "22", "33", "44"] }]);
  assert.strictEqual(r.applied.length, 1, "pega-4-real aplicado");
  let model = new Function(fs.readFileSync(dataCopy, "utf8") + "\nreturn {LOTERIAS};")();
  let g = model.LOTERIAS.find(l => l.id === "real").games.find(x => x.id === "pega-4-real");
  assert.strictEqual(g.draws[0].d, "2026-10-11");
  assert.deepStrictEqual(g.draws[0].n, ["11", "22", "33", "44"]);

  // 2. idempotencia: mismo sorteo no se duplica
  r = applyUpdates([{ gameId: "real/pega-4-real", d: "2026-10-11", n: ["11", "22", "33", "44"] }]);
  assert.strictEqual(r.applied.length, 0, "no duplica");
  assert.strictEqual(r.skipped.length, 1);

  // 3. nuevo sorteo va arriba, historial intacto
  r = applyUpdates([{ gameId: "nacional/gana-mas", d: "2026-10-11", n: ["01", "02", "03"] }]);
  assert.strictEqual(r.applied.length, 1);
  model = new Function(fs.readFileSync(dataCopy, "utf8") + "\nreturn {LOTERIAS,SITE};")();
  g = model.LOTERIAS.find(l => l.id === "nacional").games.find(x => x.id === "gana-mas");
  assert.strictEqual(g.draws[0].d, "2026-10-11");
  assert.strictEqual(g.draws[1].d, "2026-10-10", "historial preservado");

  // 4. bonus/super se guardan
  r = applyUpdates([{ gameId: "leidsa/loto", d: "2026-10-11", n: ["01", "02", "03", "04", "05", "06"], bonus: "07", super: "08" }]);
  model = new Function(fs.readFileSync(dataCopy, "utf8") + "\nreturn {LOTERIAS};")();
  g = model.LOTERIAS.find(l => l.id === "leidsa").games.find(x => x.id === "loto");
  assert.strictEqual(g.draws[0].bonus, "07");
  assert.strictEqual(g.draws[0].super, "08");

  // 5. archivo válido y guías intactas (no se tocó nada más)
  const after = fs.readFileSync(dataCopy, "utf8");
  assert.ok(after.includes("Se extraen 3 números del 00 al 99"), "guías originales intactas");
  assert.ok(after.includes("const SUENOS"), "SUENOS intacto");
  ok("update: inserción, idempotencia, historial, bonus/super, integridad");
  fs.rmSync(tmp, { recursive: true, force: true });
}

/* ---------- regresión: bugs encontrados en auditoría 2026-10-11 ---------- */
{
  const { parseB } = require("./parseB");
  const { verify } = require("./verify");
  const { titleToGame } = require("./mapping");

  // 1. parseB: fecha con salto de línea/espacios (HTML real)
  const htmlWS = `<div class="card tarjeta-loteria"><div class="card-body"><img src="https://www.sorteosrd.com/img/lotopool.png"><p class="card-text bolos text-center"><span class="bolo-noactualizado">03</span></p><p class="card-text fw-bold text-center">\n  10/10/2026</p></div></div>`;
  const pb = parseB({ u: htmlWS });
  assert.strictEqual(pb[0].dateISO, "2026-10-10", "fecha con whitespace se parsea");

  // 2. verify: misma fecha + números distintos = conflicto; fechas distintas = single (no conflicto)
  const A = [{ source: "A", gameId: "leidsa/loto-pool", dateISO: "2026-10-10", balls: [{ n: "03", special: "" }, { n: "05", special: "" }] }];
  const Bold = [{ source: "B", gameId: "leidsa/loto-pool", dateISO: "2026-10-09", balls: [{ n: "01", special: "" }, { n: "02", special: "" }] }];
  const v = verify(A, Bold);
  assert.strictEqual(v.conflicts.length, 0, "fechas distintas no es conflicto");
  assert.strictEqual(v.single.length, 1, "gana el más reciente como single");
  assert.strictEqual(v.single[0].d, "2026-10-10", "el más reciente es el de A");

  // 3. mapping: Quiniela Noche de la Nacional
  assert.strictEqual(titleToGame("Loteria Nacional- Noche"), "nacional/quiniela-noche", "mapeo quiniela noche");

  ok("regresión: fecha con whitespace, fechas distintas, mapeo noche");
}

console.log(`\nTODOS LOS TESTS PASARON (${n})`);
