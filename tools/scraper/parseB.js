/* LotoGana scraper — parser de sorteosrd.com (fuente B).
   Estructura observada 2026-10-11 (páginas /realsorteos, /sorteosleidsa,
   /nacionalsorteos):
   <div class="card tarjeta-loteria"><div class="card-body">
     <img src="https://www.sorteosrd.com/img/<logo>.png" ...>
     <h5 ...>Resultados</h5>   (siempre dice "Resultados": el juego se
                                identifica SOLO por el logo)
     <p class="card-text bolos text-center">
       <span class="bolo-noactualizado[ ...]">NN</span> ...   (bolos)
       <span class="boloazul ...">NN</span>   (bonus) · <span class="bolorojo ...">NN</span> (super)
     </p>
     <p class="card-text fw-bold text-center">DD/MM/YYYY</p>
   Devuelve [{logo, gameId, dateISO, balls:[{n, special}], page}]
*/
const { logoToGame } = require("./mapping");

function parseBPage(html, page) {
  const games = [];
  const blocks = html.split('<div class="card tarjeta-loteria">').slice(1);
  for (const b of blocks) {
    const logoM = b.match(/<img src="(?:https:\/\/www\.sorteosrd\.com\/)?img\/([a-z0-9]+)\.png"/i);
    const logo = logoM ? logoM[1] : null;

    const balls = [];
    const ballRe = /<span class="([^"]*)"[^>]*>(\d{1,3})<\/span>/g;
    let m;
    while ((m = ballRe.exec(b))) {
      const cls = m[1];
      if (!cls.includes("bolo")) continue; // solo bolos
      let special = "";
      if (cls.includes("boloazul")) special = "azul";   // bonus
      else if (cls.includes("bolorojo")) special = "rojo"; // super
      balls.push({ n: m[2].padStart(2, "0"), special });
    }
    if (!balls.length) continue;

    const dateM = b.match(/<p class="card-text fw-bold text-center">(\d{1,2})\/(\d{1,2})\/(\d{4})<\/p>/);
    const dateISO = dateM
      ? `${dateM[3]}-${dateM[2].padStart(2, "0")}-${dateM[1].padStart(2, "0")}`
      : null;

    games.push({
      source: "sorteosrd",
      logo,
      gameId: logo ? logoToGame(logo) : null,
      dateISO,
      balls,
      page,
    });
  }
  return games;
}

function parseB(pages) {
  // pages: {url: html}
  const out = [];
  for (const [url, html] of Object.entries(pages)) {
    out.push(...parseBPage(html, url));
  }
  return out;
}

module.exports = { parseBPage, parseB };
