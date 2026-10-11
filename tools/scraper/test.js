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

  // 4. verify: bolo rojo decorativo (sorteosrd) cuenta como número normal si el juego no es SPECIAL_GAMES
  const Ad = [{ source: "A", gameId: "lotedom/agarra-4", dateISO: "2026-10-11",
    balls: [{ n: "94", special: "" }, { n: "78", special: "" }, { n: "49", special: "" }, { n: "69", special: "red" }] }];
  const Bd = [{ source: "B", gameId: "lotedom/agarra-4", dateISO: "2026-10-11",
    balls: [{ n: "94", special: "" }, { n: "78", special: "" }, { n: "49", special: "" }, { n: "69", special: "rojo" }] }];
  const vd = verify(Ad, Bd);
  assert.strictEqual(vd.verified.length, 1, "rojo decorativo no rompe la verificación");
  assert.strictEqual(vd.conflicts.length, 0, "sin conflicto con rojo decorativo");

  ok("regresión: fecha con whitespace, fechas distintas, mapeo noche, rojo decorativo");
}

/* ---------- regresión: bugs auditoría 2026-10-11 (orden oficial) ---------- */
{
  const { parseA } = require("./parseA");
  const { verify, origDraw, canon } = require("./verify");
  const ord = ns => ns.map(n => ({ n, special: "" }));

  // 1. verify conserva el orden OFICIAL de la fuente A (1ro/2do/3ro),
  //    aunque B traiga otro orden: no se publica "ordenado".
  const A = [{ source: "A", gameId: "leidsa/quiniela-pale", dateISO: "2026-10-10", balls: ord(["47", "55", "19"]) }];
  const B = [{ source: "B", gameId: "leidsa/quiniela-pale", dateISO: "2026-10-10", balls: ord(["19", "47", "55"]) }];
  const v = verify(A, B);
  assert.strictEqual(v.verified.length, 1, "verificado");
  assert.deepStrictEqual(v.verified[0].n, ["47", "55", "19"], "orden oficial de A preservado");

  // 2. origDraw no ordena; canon sí (solo para comparar).
  const od = origDraw(A[0]);
  assert.deepStrictEqual(od.nums, ["47", "55", "19"], "origDraw conserva orden");
  const cn = canon(A[0]);
  assert.deepStrictEqual(cn.nums, ["19", "47", "55"], "canon ordena para comparar");

  // 3. idempotencia insensible al orden: re-aplicar el mismo sorteo con
  //    otro orden NO duplica (segunda pasada corrige el orden).
  const os = require("os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lg-ord-"));
  const dataCopy = path.join(tmp, "data.js");
  fs.copyFileSync(path.join(__dirname, "..", "..", "assets", "data.js"), dataCopy);
  const updSrc = fs.readFileSync(path.join(__dirname, "update.js"), "utf8")
    .replace(/const DATA = .*;/, `const DATA = ${JSON.stringify(dataCopy)};`)
    .replace(/const BUILD = .*;/, `const BUILD = ${JSON.stringify(path.join(__dirname, "..", "build.js"))};`);
  const updPath = path.join(tmp, "update.js");
  fs.writeFileSync(updPath, updSrc);
  delete require.cache[updPath];
  const { applyUpdates } = require(updPath);
  const load = () => new Function(fs.readFileSync(dataCopy, "utf8") + "\nreturn {LOTERIAS};")()
    .LOTERIAS.find(l => l.id === "leidsa").games.find(x => x.id === "quiniela-pale");

  let r = applyUpdates([{ gameId: "leidsa/quiniela-pale", d: "2026-10-10", n: ["47", "55", "19"] }]);
  assert.strictEqual(load().draws.filter(x => x.d === "2026-10-10").length, 1, "sin duplicados misma fecha");
  r = applyUpdates([{ gameId: "leidsa/quiniela-pale", d: "2026-10-10", n: ["19", "47", "55"] }]);
  const rows = load().draws.filter(x => x.d === "2026-10-10");
  assert.strictEqual(rows.length, 1, "re-orden no duplica");
  assert.deepStrictEqual(rows[0].n, ["19", "47", "55"], "el orden de la fuente manda");
  r = applyUpdates([{ gameId: "leidsa/quiniela-pale", d: "2026-10-10", n: ["19", "47", "55"] }]);
  assert.strictEqual(r.applied.length, 0, "tercera pasada: ya actualizado");

  // 4. limpieza de duplicados preexistentes (misma fecha, distinto orden).
  const srcTxt = fs.readFileSync(dataCopy, "utf8")
    .replace('{ d: "2026-10-10", n: ["19","47","55"] }',
             '{ d: "2026-10-10", n: ["19","47","55"] }, { d: "2026-10-10", n: ["47","55","19"] }');
  fs.writeFileSync(dataCopy, srcTxt);
  assert.strictEqual(load().draws.filter(x => x.d === "2026-10-10").length, 2, "duplicado simulado");
  r = applyUpdates([{ gameId: "leidsa/quiniela-pale", d: "2026-10-10", n: ["47", "55", "19"] }]);
  const clean = load().draws.filter(x => x.d === "2026-10-10");
  assert.strictEqual(clean.length, 1, "duplicado eliminado");
  assert.deepStrictEqual(clean[0].n, ["47", "55", "19"], "queda el orden oficial");
  assert.ok(r.applied[0] && /orden|duplicados/.test(r.applied[0].note || ""), "reporta limpieza");
  fs.rmSync(tmp, { recursive: true, force: true });

  // 5. americanas: ball-red → bonus (no a la base) + extra "2X".
  const pbHtml = `<div class="result-item col-12"><div class="col-12 result-item-title"><h4>Power Ball</h4></div>` +
    `<div class="ball"><span>01</span></div><div class="ball"><span>04</span></div><div class="ball"><span>19</span></div>` +
    `<div class="ball"><span>33</span></div><div class="ball"><span>51</span></div><div class="ball-red"><span>15</span></div>` +
    `<div class="square"><span>2X</span></div>` +
    `<div class="x result-item-date"><span><i></i>&nbsp;10-10-2026</span></div></div>`;
  const pg = parseA(pbHtml);
  assert.strictEqual(pg.length, 1, "powerball parseado");
  assert.strictEqual(pg[0].gameId, "americanas/Powerball");
  assert.strictEqual(pg[0].extra, "2X", "extra Power Play extraído");
  const cpb = canon(pg[0]);
  assert.deepStrictEqual(cpb.nums, ["01", "04", "19", "33", "51"], "base sin la PB");
  assert.strictEqual(cpb.bonus, "15", "PB como bonus");
  const vpb = verify(pg, []);
  assert.strictEqual(vpb.single[0].bonus, "15", "single conserva bonus");
  assert.strictEqual(vpb.single[0].extra, "2X", "single conserva extra");
  assert.deepStrictEqual(vpb.single[0].n, ["01", "04", "19", "33", "51"], "single conserva orden");

  ok("regresión: orden oficial, idempotencia, dedupe, americanas bonus/extra");
}

console.log(`\nTODOS LOS TESTS PASARON (${n})`);
