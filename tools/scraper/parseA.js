/* LotoGana scraper — parser de loteriadominicana.com.do (fuente A).
   Estructura observada 2026-10-11:
   <div class="result-item col-12">
     <div class="col-12 result-item-title"><h4>TÍTULO</h4></div>
     ... <div class="ball[-red|-green|-yellow]"><span>NN</span></div> ...
     <div class="... result-item-date"><span><i ...></i>&nbsp;DD-MM-YYYY</span></div>
   Devuelve [{title, gameId, dateISO, balls:[{n, special}], jackpot}]
*/
const { titleToGame } = require("./mapping");

function parseA(html) {
  const games = [];
  const blocks = html.split('<div class="result-item col-12">').slice(1);
  for (const b of blocks) {
    const titleM = b.match(/<div class="col-12 result-item-title"><h4>(.*?)<\/h4><\/div>/s);
    if (!titleM) continue;
    const title = titleM[1].replace(/<[^>]+>/g, "").trim();

    const balls = [];
    const ballRe = /<div class="ball(-red|-green|-yellow)?"><span>(\d{1,3})<\/span><\/div>/g;
    let m;
    while ((m = ballRe.exec(b))) {
      balls.push({ n: m[2].padStart(2, "0"), special: m[1] || "" });
    }
    if (!balls.length) continue;

    const dateM = b.match(/result-item-date">\s*<span><i[^>]*><\/i>(?:&nbsp;|\u00a0|\s)+(\d{2})-(\d{2})-(\d{4})/s);
    const dateISO = dateM ? `${dateM[3]}-${dateM[2]}-${dateM[1]}` : null;

    const jackM = b.match(/result-item-amount">([\s\S]*?)<\/div>/);
    const jackpot = jackM ? jackM[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : null;

    games.push({
      source: "loteriadominicana",
      title,
      gameId: titleToGame(title),
      dateISO,
      balls,
      jackpot,
    });
  }
  return games;
}

module.exports = { parseA };
