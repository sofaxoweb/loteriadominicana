/* LotoGana scraper — orquestador.
   Uso:
     node tools/scraper/run.js                 → descarga real (cortesía)
     node tools/scraper/run.js --fixtures=dir  → usa HTML locales (tests)
     node tools/scraper/run.js --dry           → no escribe data.js

   Salidas:
     tools/scraper/report.json  → {verified, single, conflicts, unmapped, errors, applied, skipped}
   Códigos: 0 = todo verificado / sin cambios · 2 = conflictos o errores
             (los sorteos verificados SÍ se aplican aunque haya conflictos).
*/
const fs = require("fs");
const path = require("path");
const { fetchAll, SOURCES } = require("./fetch");
const { parseA } = require("./parseA");
const { parseB } = require("./parseB");
const { verify } = require("./verify");
const { applyUpdates } = require("./update");

const DIR = __dirname;
const REPORT = path.join(DIR, "report.json");

function args() {
  const o = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)(=(.*))?$/);
    if (m) o[m[1]] = m[3] === undefined ? true : m[3];
  }
  return o;
}

async function main() {
  const o = args();
  const report = {
    at: new Date().toISOString(), verified: [], single: [],
    conflicts: [], unmapped: [], errors: [], applied: [], skipped: [],
  };
  let pagesA = {}, pagesB = {};

  try {
    if (o.fixtures) {
      const dir = path.resolve(o.fixtures);
      for (const f of fs.readdirSync(dir)) {
        const html = fs.readFileSync(path.join(dir, f), "utf8");
        if (f.startsWith("a-")) pagesA[f] = html; else pagesB[f] = html;
      }
      if (!Object.keys(pagesA).length && !Object.keys(pagesB).length)
        throw new Error("sin fixtures en " + dir);
    } else {
      const { pages, errors } = await fetchAll(2500);
      report.errors.push(...errors);
      for (const [url, html] of Object.entries(pages)) {
        if (SOURCES.loteriadominicana.includes(url)) pagesA[url] = html;
        else pagesB[url] = html;
      }
      if (!Object.keys(pagesA).length) report.errors.push("fuente A sin respuesta");
      if (!Object.keys(pagesB).length) report.errors.push("fuente B sin respuesta");
    }

    const gamesA = Object.values(pagesA).flatMap(h => parseA(h));
    const gamesB = parseB(pagesB);
    const v = verify(gamesA, gamesB);
    Object.assign(report, {
      verified: v.verified, single: v.single,
      conflicts: v.conflicts, unmapped: v.unmapped,
    });

    const toApply = [...v.verified, ...v.single].map(x => ({
      gameId: x.gameId, d: x.d, n: x.n, bonus: x.bonus, super: x.super,
    }));

    if (o.dry) {
      report.dry = true;
      report.wouldApply = toApply;
    } else if (toApply.length) {
      const r = applyUpdates(toApply);
      report.applied = r.applied;
      report.skipped = r.skipped;
    }
  } catch (e) {
    report.errors.push("fatal: " + e.message);
  }

  fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));
  const bad = report.conflicts.length + report.errors.length;
  console.log(`verificados: ${report.verified.length} · single: ${report.single.length} · ` +
    `conflictos: ${report.conflicts.length} · aplicados: ${report.applied.length} · ` +
    `errores: ${report.errors.length}`);
  if (report.conflicts.length) {
    console.log("CONFLICTOS (no publicados):");
    for (const c of report.conflicts)
      console.log(` - ${c.gameId}: A=${c.a.date} [${c.a.nums}] vs B=${c.b.date} [${c.b.nums}]`);
  }
  process.exit(bad ? 2 : 0);
}

main();
