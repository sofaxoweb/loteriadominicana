/* LotoGana scraper — mapeo de juegos de las fuentes a nuestros IDs.
   gameId: "lotId/gameId" para LOTERIAS, "americanas/<Nombre>" para AMERICANAS. */

function norm(s) {
  return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

/* Títulos <h4> de loteriadominicana.com.do → gameId */
const TITLE_TO_GAME = {
  "loteria nacional- gana más": "nacional/gana-mas",
  "loteria nacional- noche": "nacional/quiniela-noche",
  "quiniela palé": "leidsa/quiniela-pale",
  "pega 3 más": "leidsa/pega-3-mas",
  "loto pool": "leidsa/loto-pool",
  "super kino tv": "leidsa/super-kino",
  "loto": "leidsa/loto",
  "quiniela real": "real/quiniela-real",
  "loto real": "real/loto-real",
  "quiniela loteka": "loteka/quiniela-loteka",
  "mega chance": "loteka/mega-chance",
  "lotto loteka": "loteka/lotto-loteka",
  "quiniela la primera": "la-primera/quiniela",
  "quiniela la primera noche": "la-primera/quiniela-noche",
  "lotto 5": "la-primera/lotto-5",
  "quiniela la suerte": "la-suerte/quiniela",
  "quiniela la suerte 6pm": "la-suerte/quiniela-6pm",
  "quiniela lotedom": "lotedom/quiniela",
  "el quemaito mayor": "lotedom/quemaito",
  "new york tarde": "new-york/tarde",
  "new york noche": "new-york/noche",
  "florida tarde": "florida/tarde",
  "florida noche": "florida/noche",
  "mega millions": "americanas/Mega Millions",
  "power ball": "americanas/Powerball",
  "anguila 10am": "anguila/10am",
  "anguila 1pm": "anguila/1pm",
  "anguila 6pm": "anguila/6pm",
  "anguila 9pm": "anguila/9pm",
  "sxm- quiniela dia": "king-lottery/dia",
  "sxm- quiniela noche": "king-lottery/noche",
};

/* Logos img/<name>.png de sorteosrd.com → gameId */
const LOGO_TO_GAME = {
  "lotopool": "leidsa/loto-pool",
  "superkino": "leidsa/super-kino",
  "pega3mas": "leidsa/pega-3-mas",
  "loto": "leidsa/loto",
  "lotopoolreal": "real/loto-pool-real",
  "pega4real": "real/pega-4-real",
  "nuevayolreal": "real/nueva-yol",
  "tufechareal": "real/tu-fecha",
  "lotoreal1": "real/loto-real",
  "pegamasjuegamas": "nacional/pega-3-mas",
};

/* Juegos con bolos especiales (bonus/super) en nuestro modelo */
const SPECIAL_GAMES = {
  "leidsa/loto": { bonus: true, super: true },
  "loteka/lotto-loteka": { bonus: true, super: true },
};

function titleToGame(title) { return TITLE_TO_GAME[norm(title)] || null; }
function logoToGame(logo) { return LOGO_TO_GAME[norm(logo)] || null; }

module.exports = { norm, titleToGame, logoToGame, SPECIAL_GAMES };
