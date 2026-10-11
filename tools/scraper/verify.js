/* LotoGana scraper — verificación cruzada entre fuentes.
   Reglas:
   - Un juego en AMBAS fuentes con MISMA fecha: los números (ordenados)
     deben coincidir exactamente → VERIFIED. Si no → CONFLICT (no se publica).
   - Un juego en AMBAS fuentes con FECHAS distintas: una está desactualizada
     (no es conflicto) → se publica el sorteo más reciente como SINGLE.
   - Un juego en UNA sola fuente → SINGLE (se publica, marcado como tal).
   - Comparación insensible al orden de los bolos (las fuentes los ordenan
     distinto) pero sensible a duplicados (ej. 35,35).
*/
const { SPECIAL_GAMES } = require("./mapping");

/* Extrae bonus/super de los bolos especiales. Lógica compartida por
   canon() (comparación, ordena la base) y origDraw() (almacenamiento,
   conserva el orden oficial 1ro/2do/3ro de la fuente). */
function splitSpecial(g) {
  const spec = SPECIAL_GAMES[g.gameId] || {};
  const base = [];
  let bonus = null, sup = null;
  for (const b of g.balls) {
    const s = b.special;
    // sorteosrd: boloazul = bonus, bolorojo = super — solo en juegos SPECIAL_GAMES.
    // En otras páginas el rojo es decorativo y el número SÍ es parte del resultado.
    if (s === "azul" && spec.bonus) { bonus = b.n; continue; }
    if (s === "rojo" && spec.super) { sup = b.n; continue; }
    if (s && spec.bonus && bonus === null) { bonus = b.n; continue; }
    if (s && spec.super && sup === null) { sup = b.n; continue; }
    base.push(b.n);
  }
  return { base, bonus, super: sup };
}

/* Normaliza un juego parseado a forma canónica comparable.
   - sorteosrd: boloazul = bonus, bolorojo = super, solo en juegos SPECIAL_GAMES
     (en otras páginas el rojo es decorativo y cuenta como número normal).
   - loteriadominicana: primer bolo especial = bonus, segundo = super,
     solo en juegos de SPECIAL_GAMES; el resto va a la base. */
function canon(g) {
  const { base, bonus, super: sup } = splitSpecial(g);
  base.sort();
  return { gameId: g.gameId, date: g.dateISO, nums: base, bonus, super: sup, extra: g.extra || null };
}

/* Sorteo en el orden ORIGINAL de la fuente (para guardar en data.js).
   El orden oficial 1ro/2do/3ro nunca se altera. */
function origDraw(g) {
  const { base, bonus, super: sup } = splitSpecial(g);
  return { gameId: g.gameId, date: g.dateISO, nums: base, bonus, super: sup, extra: g.extra || null };
}

function sameDraw(a, b) {
  return a.date === b.date &&
    a.nums.join(",") === b.nums.join(",") &&
    (a.bonus || null) === (b.bonus || null) &&
    (a.super || null) === (b.super || null) &&
    (a.extra || null) === (b.extra || null);
}

function verify(gamesA, gamesB) {
  const byId = list => {
    const m = new Map();
    for (const g of list) {
      if (!g.gameId || !g.dateISO) continue;
      if (!m.has(g.gameId)) m.set(g.gameId, g); // primer bloque manda
    }
    return m;
  };
  const A = byId(gamesA), B = byId(gamesB);
  const ids = new Set([...A.keys(), ...B.keys()]);

  const verified = [], single = [], conflicts = [], unmapped = [];
  for (const g of [...gamesA, ...gamesB]) {
    if (!g.gameId) unmapped.push({ source: g.source, title: g.title || g.logo, date: g.dateISO });
  }

  const out = o => ({ gameId: o.gameId, d: o.date, n: o.nums, bonus: o.bonus, super: o.super, extra: o.extra });

  for (const id of ids) {
    const a = A.get(id), b = B.get(id);
    if (a && b) {
      const ca = canon(a), cb = canon(b);
      if (sameDraw(ca, cb)) {
        // Verificado: se guarda el orden OFICIAL de la fuente A (1ro/2do/3ro).
        verified.push({ ...out(origDraw(a)), sources: ["A", "B"] });
      } else if (ca.date === cb.date) {
        // Misma fecha, números distintos = conflicto real: no se publica.
        conflicts.push({
          gameId: id,
          a: { date: ca.date, nums: ca.nums, bonus: ca.bonus, super: ca.super },
          b: { date: cb.date, nums: cb.nums, bonus: cb.bonus, super: cb.super },
        });
      } else {
        // Fechas distintas = una fuente está desactualizada (no es conflicto):
        // se publica el sorteo más reciente como single.
        const aNewer = ca.date > cb.date;
        single.push({ ...out(origDraw(aNewer ? a : b)),
          sources: [aNewer ? "A" : "B"], staleOther: true });
      }
    } else {
      const g = a || b;
      single.push({ ...out(origDraw(g)), sources: [a ? "A" : "B"] });
    }
  }
  return { verified, single, conflicts, unmapped };
}

module.exports = { canon, origDraw, sameDraw, verify };
