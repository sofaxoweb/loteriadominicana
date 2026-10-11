/* LotoGana — generador de páginas de loterías.
   Uso: node tools/build.js
   Lee assets/data.js y genera loteria/<id>/index.html + loteria/index.html */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const dataSrc = fs.readFileSync(path.join(ROOT, "assets", "data.js"), "utf8");
const { SITE, LOTERIAS } = new Function(dataSrc + "\nreturn {SITE, LOTERIAS};")();
const contentSrc = fs.readFileSync(path.join(ROOT, "assets", "content.js"), "utf8");
const { ABOUT, GUIDES, MORE_FAQS, HOME_SECTIONS, GAME_INTROS, LOTTERY_EXTRA, METHODOLOGY, RESPONSIBLE } =
  new Function(contentSrc + "\nreturn {ABOUT, GUIDES, MORE_FAQS, HOME_SECTIONS, GAME_INTROS, LOTTERY_EXTRA, METHODOLOGY, RESPONSIBLE};")();

const NAV = [
  ["", "Inicio"], ["loteria/", "Loterías"], ["verificador/", "Verificador"],
  ["suenos/", "Sueños"], ["numeros/", "Números"], ["predicciones/", "Predicciones"]
];

/* Dominio real del sitio — CAMBIAR al desplegar (se usa en sitemap.xml). */
const BASE_URL = "https://lotogana.example.com";

function header(rel, active, title, metaDesc, extraHead = "") {
  const links = NAV.map(([href, label]) =>
    `<a href="${rel}${href}" class="${active === href ? "active" : ""}">${label}</a>`).join("");
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${metaDesc}">
<link rel="icon" href="${rel}assets/logo.svg" type="image/svg+xml">
<link rel="stylesheet" href="${rel}assets/styles.css">
${extraHead}
</head>
<body>
<div class="topbar"><div class="wrap">
  <span class="live"><span class="dot"></span> Resultados actualizados</span>
  <span>República Dominicana · <span data-fmt-date="${SITE.updated}">${SITE.updated}</span></span>
</div></div>
<header class="site"><div class="nav">
  <a class="brand" href="${rel}"><img src="${rel}assets/logo.svg" alt="LotoGana"><span>LotoGana<small>${SITE.tagline}</small></span></a>
  <button class="menu-btn" id="menuBtn" aria-label="Menú">☰</button>
  <nav class="links" id="navLinks">${links}</nav>
</div></header>
`;
}

function footer(rel) {
  const lotLinks = LOTERIAS.map(l => `<a href="${rel}loteria/${l.id}/">${l.name}</a>`).join("");
  return `<footer class="site"><div class="wrap">
  <div><h4>LotoGana</h4><p>${SITE.description}</p></div>
  <div><h4>Loterías</h4>${lotLinks}</div>
  <div><h4>Herramientas</h4>
    <a href="${rel}verificador/">Verificador de jugadas</a>
    <a href="${rel}suenos/">Sueños y charada</a>
    <a href="${rel}numeros/">Números calientes</a>
    <a href="${rel}predicciones/">Predicciones</a>
  </div>
  <div><h4>Nosotros</h4>
    <a href="${rel}nosotros/">Quiénes somos</a>
    <a href="${rel}contacto/">Contacto</a>
    <a href="${rel}privacidad/">Privacidad</a>
  </div>
</div><div class="copy">© 2026 LotoGana · Juega responsablemente · Solo +18 · Los resultados son de referencia.</div></footer>
<script src="${rel}assets/data.js"></script>
<script src="${rel}assets/app.js"></script>
</body></html>`;
}

function ballsHTML(draw, kind) {
  const n = draw.n;
  const ball = x => `<span class="ball${x.length > 2 ? " long" : ""}">${x}</span>`;
  if (kind === "trio" || kind === "billete") {
    const labels = ["1ro", "2do", "3ro"];
    return n.slice(0, 3).map((x, i) =>
      `<span class="ball-label">${labels[i]}</span>${ball(x)}`).join(" ") +
      (n.length > 3 ? " " + n.slice(3).map(ball).join(" ") : "");
  }
  let html = n.map(ball).join(" ");
  if (draw.bonus) html += ` <span class="ball-label">Más</span> <span class="ball gold">${draw.bonus}</span>`;
  if (draw.super) html += ` <span class="ball-label">Súper</span> <span class="ball gold">${draw.super}</span>`;
  return html;
}

function fmtD(iso) { const p = iso.split("-"); return `${p[2]}/${p[1]}/${p[0]}`; }

function faqJSON(faqs) {
  const items = faqs.map(f => `{"@type":"Question","name":${JSON.stringify(f.q)},"acceptedAnswer":{"@type":"Answer","text":${JSON.stringify(f.a)}}}`).join(",");
  return `<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${items}]}</script>`;
}

function lotteryFAQs(lot) {
  const times = lot.games.map(g => `${g.name} (${g.time})`).join(", ");
  const g0 = lot.games[0];
  const jack = lot.games.find(g => g.jackpot);
  return [
    { q: `¿A qué hora son los sorteos de ${lot.name}?`, a: `Los sorteos de ${lot.name} son: ${times}. LotoGana publica los resultados minutos después de cada extracción.` },
    { q: `¿Dónde puedo ver los resultados de ${lot.name} de hoy?`, a: `En esta página verás los últimos resultados de ${lot.name}, con historial y la cuenta regresiva del próximo sorteo.` },
    { q: `¿Cómo se juega ${g0.name}?`, a: g0.guide },
    jack
      ? { q: `¿${lot.name} tiene premio acumulado?`, a: `Sí: ${jack.name} tiene un premio mínimo acumulado de ${jack.jackpot}.` }
      : { q: `¿Cómo sé si gané en ${lot.name}?`, a: `Usa nuestro verificador de jugadas: escribe tus números y te decimos si coinciden con los últimos sorteos.` }
  ];
}

function operatorPage(lot) {
  const rel = "../../";
  const gameNames = lot.games.map(g => g.name).join(", ");
  const title = `Resultados ${lot.name} — ${gameNames} | LotoGana`;
  const meta = `Resultados de hoy de ${lot.name}: ${gameNames}. Números ganadores, horarios, historial y cuenta regresiva del próximo sorteo.`;
  const faqs = lotteryFAQs(lot).concat(MORE_FAQS[lot.id] || []);

  let games = "";
  lot.games.filter(g => g.draws && g.draws.length).forEach(g => {
    const latest = g.draws[0];
    const hist = g.draws.map(d =>
      `<tr><td>${fmtD(d.d)}</td><td>${d.n.join(" - ")}${d.bonus ? " · Más " + d.bonus : ""}${d.super ? " · Súper " + d.super : ""}</td></tr>`).join("");
    games += `<div class="card" id="${g.id}">
      <div class="card-head"><span class="badge" style="background:${lot.color}">${lot.name.slice(0,2).toUpperCase()}</span>
      <h3><a href="${g.id}/">${g.name}</a></h3><span class="time">${g.time}</span></div>
      <div class="card-body">
        <div class="balls">${ballsHTML(latest, g.kind)}</div>
        <div class="meta" style="font-size:.8rem;color:#5b6b60;margin-top:8px">Sorteo del <span data-fmt-date="${latest.d}">${latest.d}</span></div>
        ${g.jackpot ? `<div class="jackpot">Premio acumulado: ${g.jackpot}</div>` : ""}
        <div class="countdown" data-countdown="${g.time}"${g.days ? ` data-days="${g.days.join(",")}"` : ""}></div>
        <div class="guide"><strong>¿Cómo se juega?</strong> ${GUIDES[lot.id + "/" + g.id] || g.guide}</div>
        ${g.draws.length > 1 ? `<table class="hist"><tr><th>Fecha</th><th>Números</th></tr>${hist}</table>` : ""}
      </div></div>`;
  });

  const others = LOTERIAS.filter(l => l.id !== lot.id)
    .map(l => `<a href="${rel}loteria/${l.id}/" class="tool"><h3>${l.name}</h3><p>Ver resultados →</p></a>`).join("");

  const faqHtml = faqs.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("");

  return header(rel, "loteria/", title, meta, faqJSON(faqs)) + `
<main class="wrap">
  <div class="section">
    <h2><span class="badge" style="background:${lot.color}">${lot.name.slice(0,2).toUpperCase()}</span> Resultados ${lot.name}</h2>
    <p class="sub">${lot.desc}</p>
    <div class="card"><div class="card-body about">${ABOUT[lot.id] || ""}${LOTTERY_EXTRA[lot.id] ? `<p>${LOTTERY_EXTRA[lot.id]}</p>` : ""}</div></div>
    <div class="adslot">Espacio publicitario</div>
    <div class="grid">${games}</div>
  </div>
  <div class="section">
    <h2>Preguntas frecuentes — ${lot.name}</h2>
    <div class="faq">${faqHtml}</div>
  </div>
  <div class="section">
    <h2>Otras loterías</h2>
    <div class="toolbox">${others}</div>
  </div>
</main>` + footer(rel);
}

function gameFAQsExtra(lot, g) {
  const faqs = [
    { q: `¿A qué hora se publica el resultado de ${g.name} en LotoGana?`,
      a: `El sorteo de ${g.name} es a las ${g.time}. Nuestro sistema lo publica en esta página minutos después de la extracción, una vez verificado contra dos fuentes independientes.` },
  ];
  if (g.kind === "trio") {
    faqs.push({ q: `¿Qué se puede jugar en ${g.name}: quiniela, palé o tripleta?`,
      a: `En ${g.name} puedes jugar la quiniela (un número de dos cifras), el palé (dos números combinados) y la tripleta (tres números). Ganas si tu jugada coincide con los números de la extracción de las ${g.time}.` });
  } else if (g.kind === "billete") {
    faqs.push({ q: `¿Cómo se gana en ${g.name}?`,
      a: `En ${g.name} juegas con un billete impreso de 6 cifras. Si tu número coincide con el 1ro, 2do o 3er premio del sorteo dominical de las ${g.time}, ganas el premio correspondiente.` });
  } else {
    const n = lot.games.filter(x => x.draws && x.draws.length).length;
    faqs.push({ q: `¿Cuántos sorteos al día tiene ${lot.name}?`,
      a: `${lot.name} celebra ${n} sorteo${n > 1 ? "s" : ""} al día: ${lot.games.filter(x => x.draws && x.draws.length).map(x => `${x.name} (${x.time})`).join(", ")}.` });
  }
  return faqs;
}

function gameFAQs(lot, g) {
  const plainGuide = (GUIDES[lot.id + "/" + g.id] || g.guide).replace(/<[^>]+>/g, "");
  return [
    { q: `¿A qué hora es el sorteo de ${g.name}?`,
      a: `El sorteo de ${g.name} (${lot.name}) se celebra a las ${g.time}. En esta página tienes la cuenta regresiva en vivo y el resultado se publica minutos después de la extracción.` },
    { q: `¿Cómo se juega ${g.name}?`, a: plainGuide },
    { q: `¿Dónde ver los resultados de ${g.name} de hoy?`,
      a: `Aquí mismo, en LotoGana: publicamos los números ganadores de ${g.name} apenas termina el sorteo, junto con el historial de sorteos anteriores. También puedes ver todos los juegos de ${lot.name} en su página.` },
  ];
}

function gamePage(lot, g) {
  const rel = "../../../";
  const guide = GUIDES[lot.id + "/" + g.id] || g.guide;
  const latest = g.draws[0];
  const faqs = gameFAQs(lot, g).concat(gameFAQsExtra(lot, g));
  const intro = GAME_INTROS[lot.id + "/" + g.id] || "";
  const title = `${g.name} (${lot.name}) — resultados de hoy | LotoGana`;
  const meta = `Resultados de hoy de ${g.name} (${lot.name}): números ganadores del ${fmtD(latest.d)}, horario ${g.time}, historial completo y cómo jugar.`;
  const hist = g.draws.map(d =>
    `<tr><td>${fmtD(d.d)}</td><td>${d.n.join(" - ")}${d.bonus ? " · Más " + d.bonus : ""}${d.super ? " · Súper " + d.super : ""}</td></tr>`).join("");
  const others = lot.games
    .filter(x => x.id !== g.id && x.draws && x.draws.length)
    .map(x => `<a href="../${x.id}/" class="tool"><h3>${x.name}</h3><p>Ver resultados →</p></a>`).join("");

  return header(rel, "loteria/", title, meta, faqJSON(faqs)) + `
<main class="wrap">
  <div class="section">
    <p style="font-size:.85rem;color:#5b6b60;margin-bottom:10px"><a href="${rel}">Inicio</a> · <a href="${rel}loteria/">Loterías</a> · <a href="../">${lot.name}</a> · ${g.name}</p>
    <h2><span class="badge" style="background:${lot.color}">${lot.name.slice(0,2).toUpperCase()}</span> ${g.name} — resultados de hoy</h2>
    <p class="sub">${lot.name} · sorteo de las ${g.time}</p>
    ${intro ? `<div class="card"><div class="card-body about"><p>${intro}</p></div></div>` : ""}
    <div class="adslot">Espacio publicitario</div>
    <div class="card">
      <div class="card-head"><span class="badge" style="background:${lot.color}">${lot.name.slice(0,2).toUpperCase()}</span>
      <h3>Último sorteo</h3><span class="time">${g.time}</span></div>
      <div class="card-body">
        <div class="balls">${ballsHTML(latest, g.kind)}</div>
        <div class="meta" style="font-size:.85rem;color:#5b6b60;margin-top:8px">Sorteo del <span data-fmt-date="${latest.d}">${latest.d}</span></div>
        ${g.jackpot ? `<div class="jackpot">Premio acumulado: ${g.jackpot}</div>` : ""}
        <div class="countdown" data-countdown="${g.time}"${g.days ? ` data-days="${g.days.join(",")}"` : ""}></div>
      </div>
    </div>
    <div class="card" style="margin-top:16px"><div class="card-body">
      <h3 style="margin-bottom:8px">¿Cómo se juega ${g.name}?</h3>
      <div class="about"><p>${guide}</p></div>
    </div></div>
    ${g.draws.length > 1 ? `<div class="card" style="margin-top:16px"><div class="card-body">
      <h3 style="margin-bottom:8px">Historial de sorteos</h3>
      <table class="hist"><tr><th>Fecha</th><th>Números ganadores</th></tr>${hist}</table>
    </div></div>` : ""}
  </div>
  <div class="section">
    <h2>Preguntas frecuentes — ${g.name}</h2>
    <div class="faq">${faqs.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}</div>
  </div>
  ${others ? `<div class="section">
    <h2>Más juegos de ${lot.name}</h2>
    <div class="toolbox">${others}</div>
  </div>` : ""}
</main>` + footer(rel);
}

function hubPage() {
  const rel = "../";
  const cards = LOTERIAS.map(lot => {
    const withDraws = lot.games.filter(g => g.draws && g.draws.length);
    if (!withDraws.length) return "";
    const latest = withDraws.map(g => g.draws[0]);
    const newest = latest.sort((a, b) => b.d.localeCompare(a.d))[0];
    return `<div class="card">
      <div class="card-head"><span class="badge" style="background:${lot.color}">${lot.name.slice(0,2).toUpperCase()}</span>
      <h3><a href="${rel}loteria/${lot.id}/">${lot.name}</a></h3></div>
      <div class="card-body"><p style="font-size:.9rem;color:#5b6b60">${lot.desc}</p>
      <p style="margin-top:8px;font-size:.88rem"><strong>${lot.games.length}</strong> juegos · último sorteo: <span data-fmt-date="${newest.d}">${newest.d}</span></p></div>
      <div class="card-foot"><a href="${rel}loteria/${lot.id}/">Ver resultados →</a></div>
    </div>`;
  }).join("");
  return header(rel, "loteria/", "Todas las loterías — resultados y horarios | LotoGana",
    "Directorio completo de loterías dominicanas e internacionales: Nacional, Leidsa, Real, Loteka, La Primera, La Suerte, Lotedom, New York, Florida, Anguila y más.") + `
<main class="wrap">
  <div class="section">
    <h2>Todas las loterías</h2>
    <p class="sub">${LOTERIAS.length} loterías · resultados actualizados a diario</p>
    <div class="grid">${cards}</div>
  </div>
</main>` + footer(rel);
}

/* ---------- generar ---------- */
function gameCardHTML(lot, g) {
  if (!g.draws || !g.draws.length) return "";
  const latest = g.draws[0];
  return `<div class="game">
    <div class="game-top"><strong><a href="loteria/${lot.id}/${g.id}/">${g.name}</a></strong><span class="meta">${g.time} · <span data-fmt-date="${latest.d}">${latest.d}</span></span></div>
    <div class="balls">${ballsHTML(latest, g.kind)}</div>
    ${g.jackpot ? `<div class="jackpot">Acumulado: ${g.jackpot}</div>` : ""}
    <div class="countdown" data-countdown="${g.time}"${g.days ? ` data-days="${g.days.join(",")}"` : ""}></div>
  </div>`;
}

function buildHome() {
  const { AMERICANAS } = new Function(dataSrc + "\nreturn {AMERICANAS};")();
  const rel = "";
  const dr = LOTERIAS.filter(l => l.country === "do");
  const intl = LOTERIAS.filter(l => l.country === "int");

  const drCards = dr.map(lot => `<div class="card">
    <div class="card-head"><span class="badge" style="background:${lot.color}">${lot.name.slice(0,2).toUpperCase()}</span>
    <h3><a href="loteria/${lot.id}/">${lot.name}</a></h3></div>
    <div class="card-body">${lot.games.map(g => gameCardHTML(lot, g)).join("")}</div>
    <div class="card-foot"><a href="loteria/${lot.id}/">Ver ${lot.name} →</a></div>
  </div>`).join("");

  const amCards = AMERICANAS.map(a => {
    const latest = a.draws[0];
    return `<div class="card">
      <div class="card-head"><span class="badge" style="background:#7c2d12">US</span><h3>${a.name}</h3><span class="time">${a.time}</span></div>
      <div class="card-body"><div class="balls">${ballsHTML(latest, a.kind)}</div>
      <div class="meta" style="font-size:.8rem;color:#5b6b60;margin-top:8px">Sorteo del <span data-fmt-date="${latest.d}">${latest.d}</span></div>
      <div class="jackpot">Premio estimado: ${a.jackpot}</div>
      <div class="countdown" data-countdown="${a.time}" data-days="${a.days.join(",")}"></div>
      <div class="guide">${a.guide}</div></div>
    </div>`;
  }).join("");

  const intlCards = intl.map(lot => {
    const g0 = lot.games[0], latest = g0.draws[0];
    return `<div class="card">
      <div class="card-head"><span class="badge" style="background:${lot.color}">${lot.name.slice(0,2).toUpperCase()}</span>
      <h3><a href="loteria/${lot.id}/">${lot.name}</a></h3></div>
      <div class="card-body"><div class="game-top"><strong><a href="loteria/${lot.id}/${g0.id}/">${g0.name}</a></strong><span class="meta"><span data-fmt-date="${latest.d}">${latest.d}</span></span></div>
      <div class="balls">${ballsHTML(latest, g0.kind)}</div>
      <p style="margin-top:8px;font-size:.85rem;color:#5b6b60">+ ${lot.games.length - 1} sorteos más</p></div>
      <div class="card-foot"><a href="loteria/${lot.id}/">Ver resultados →</a></div>
    </div>`;
  }).join("");

  const faqs = [
    { q: "¿A qué hora salen los resultados de las loterías dominicanas?",
      a: "Los sorteos van desde las 10:00 AM (Anguila) hasta las 11:00 PM. LotoGana publica cada resultado minutos después de su extracción, con la cuenta regresiva del próximo sorteo en cada juego." },
    { q: "¿Cómo verifico si gané mi jugada?",
      a: "Usa nuestro verificador de jugadas: escribe tus números y la herramienta los compara con los últimos sorteos de todas las loterías." },
    { q: "¿Qué es la charada de los sueños?",
      a: "Es la tradición dominicana de convertir lo soñado en números para jugar. En nuestra sección Sueños puedes buscar cualquier palabra y ver su número." },
    { q: "¿Los números calientes realmente salen más?",
      a: "Los números calientes son los que más han salido recientemente, pero cada sorteo es independiente: el azar no tiene memoria. Úsalos como referencia, no como garantía." },
    { q: "¿Cada cuánto se actualizan los resultados?",
      a: "Todos los días, después de cada sorteo. La página muestra la fecha del último sorteo publicado en cada juego." },
    { q: "¿Jugar lotería es seguro?",
      a: "Juega solo en bancas autorizadas y con un presupuesto fijo. La lotería es entretenimiento, no una forma de ganar dinero. Solo para mayores de 18 años." }
  ];

  return header(rel, "", SITE.name + " — " + SITE.tagline, SITE.description, faqJSON(faqs)) + `
<div class="hero"><div class="wrap">
  <h1>Resultados de loterías dominicanas de hoy</h1>
  <p>${SITE.description}</p>
  <div class="updated">Última actualización: <span data-fmt-date="${SITE.updated}">${SITE.updated}</span></div>
</div></div>
<main class="wrap">
  <div class="adslot">Espacio publicitario</div>
  <div class="section">
    <h2>🇩🇴 Loterías dominicanas</h2>
    <p class="sub">Resultados de hoy de la Nacional, Leidsa, Real, Loteka, La Primera, La Suerte y Lotedom</p>
    <div class="grid">${drCards}</div>
  </div>
  <div class="section">
    <h2>🇺🇸 Premios millonarios de EE. UU.</h2>
    <p class="sub">Mega Millions y Powerball con sus premios acumulados</p>
    <div class="grid">${amCards}</div>
  </div>
  <div class="section">
    <h2>🌎 Loterías internacionales</h2>
    <p class="sub">New York, Florida, Anguila, SXM, Texas, Georgia, Tennessee y Bolet</p>
    <div class="grid">${intlCards}</div>
  </div>
  <div class="section">
    <h2>Herramientas gratis</h2>
    <p class="sub">Todo lo que un jugador necesita, en un solo lugar</p>
    <div class="toolbox">
      <a class="tool" href="verificador/"><div class="icon">🎯</div><h3>Verificador de jugadas</h3><p>¿Ganaste? Comprueba tus números contra los últimos sorteos.</p></a>
      <a class="tool" href="suenos/"><div class="icon">💭</div><h3>Sueños y charada</h3><p>Busca lo que soñaste y descubre tu número de la suerte.</p></a>
      <a class="tool" href="numeros/"><div class="icon">🔥</div><h3>Números calientes y fríos</h3><p>Estadísticas de los números que más y menos salen.</p></a>
      <a class="tool" href="predicciones/"><div class="icon">🔮</div><h3>Predicciones</h3><p>Pirámide y cruz del día generadas con los últimos sorteos.</p></a>
    </div>
  </div>
  ${HOME_SECTIONS}
  <div class="section">
    ${METHODOLOGY}
  </div>
  <div class="section">
    ${RESPONSIBLE}
  </div>
  <div class="section">
    <h2>Preguntas frecuentes</h2>
    <div class="faq">${faqs.map(f => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("")}</div>
  </div>
</main>` + footer(rel);
}

LOTERIAS.forEach(lot => {
  const dir = path.join(ROOT, "loteria", lot.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), operatorPage(lot));
  console.log("ok loteria/" + lot.id + "/");
  let nGames = 0;
  lot.games.filter(g => g.draws && g.draws.length).forEach(g => {
    const gdir = path.join(dir, g.id);
    fs.mkdirSync(gdir, { recursive: true });
    fs.writeFileSync(path.join(gdir, "index.html"), gamePage(lot, g));
    nGames++;
  });
  console.log("  +", nGames, "páginas de juegos");
});
fs.writeFileSync(path.join(ROOT, "loteria", "index.html"), hubPage());
console.log("ok loteria/ (hub)");
fs.writeFileSync(path.join(ROOT, "index.html"), buildHome());
console.log("ok index.html (portada)");

// sitemap.xml (requiere BASE_URL configurado arriba)
(function sitemap() {
  const urls = [""];
  LOTERIAS.forEach(lot => {
    urls.push(`loteria/${lot.id}/`);
    lot.games.filter(g => g.draws && g.draws.length)
      .forEach(g => urls.push(`loteria/${lot.id}/${g.id}/`));
  });
  ["loteria/", "verificador/", "suenos/", "numeros/", "predicciones/",
   "nosotros/", "contacto/", "privacidad/"].forEach(p => urls.push(p));
  const xml = urls.map(u =>
    `  <url><loc>${BASE_URL}/${u}</loc><changefreq>hourly</changefreq></url>`).join("\n");
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xml}\n</urlset>`);
  console.log("ok sitemap.xml (" + urls.length + " URLs)");
})();
console.log("Total:", LOTERIAS.length, "páginas de lotería");
