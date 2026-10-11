/* LotoGana scraper — descarga HTML con cortesía (sin dependencias). */
const SOURCES = {
  loteriadominicana: ["https://www.loteriadominicana.com.do/"],
  sorteosrd: [
    "https://www.sorteosrd.com/realsorteos",
    "https://www.sorteosrd.com/sorteosleidsa",
    "https://www.sorteosrd.com/nacionalsorteos",
  ],
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 (LotoGanaBot; contacto via repo)";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchHtml(url, timeoutMs = 25000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, "Accept": "text/html", "Accept-Language": "es-DO,es;q=0.9" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

/* Descarga todas las URLs con pausa entre peticiones. Devuelve {url: html}. */
async function fetchAll(delayMs = 2500) {
  const out = {};
  const errors = [];
  const urls = [...SOURCES.loteriadominicana, ...SOURCES.sorteosrd];
  for (const url of urls) {
    try {
      out[url] = await fetchHtml(url);
    } catch (e) {
      errors.push(`${url}: ${e.message}`);
    }
    await sleep(delayMs);
  }
  return { pages: out, errors };
}

module.exports = { fetchHtml, fetchAll, SOURCES };
