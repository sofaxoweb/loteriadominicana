/* LotoGana — lógica del sitio */
(function(){
"use strict";

/* ---------- utilidades ---------- */
const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
function fmtDate(iso){
  const p = iso.split("-");
  return p[2] + " " + MESES[parseInt(p[1],10)-1] + " " + p[0];
}
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function ballHTML(n, cls){ return '<span class="ball'+(cls?" "+cls:"")+'">'+esc(n)+"</span>"; }

/* ---------- menú móvil ---------- */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if(menuBtn && navLinks){ menuBtn.addEventListener("click", () => navLinks.classList.toggle("open")); }

/* ---------- fechas de "actualizado" ---------- */
document.querySelectorAll("[data-fmt-date]").forEach(el => { el.textContent = fmtDate(el.getAttribute("data-fmt-date")); });

/* ---------- cuenta regresiva ---------- */
function nextDraw(timeStr, days, alt){
  const now = new Date();
  for(let add = 0; add < 8; add++){
    const d = new Date(now); d.setDate(d.getDate()+add);
    if(days && days.length && !days.includes(d.getDay())) continue;
    const t = (alt && alt[d.getDay()]) || timeStr;
    const [h, m] = t.split(":").map(Number);
    d.setHours(h, m, 0, 0);
    if(d > now) return d;
  }
  return null;
}
function tick(){
  document.querySelectorAll("[data-countdown]").forEach(el => {
    const daysAttr = el.getAttribute("data-days");
    const days = daysAttr ? daysAttr.split(",").map(Number) : null;
    const altAttr = el.getAttribute("data-alt");
    const alt = altAttr ? Object.fromEntries(altAttr.split(";").map(p => p.split(":"))) : null;
    const target = nextDraw(el.getAttribute("data-countdown"), days, alt);
    if(!target){ el.innerHTML = ""; return; }
    let s = Math.floor((target - new Date())/1000);
    const h = Math.floor(s/3600), m = Math.floor(s%3600/60), ss = s%60;
    const startOfToday = new Date(); startOfToday.setHours(0,0,0,0);
    const dayDiff = Math.round((new Date(target.toDateString()) - startOfToday) / 86400000);
    const when = dayDiff <= 0 ? "hoy" : dayDiff === 1 ? "mañana" : ("en " + dayDiff + " días");
    const tShown = String(target.getHours()).padStart(2,"0") + ":" + String(target.getMinutes()).padStart(2,"0");
    el.innerHTML = "Próximo sorteo: <b>" + when + " " + tShown + "</b> · faltan <b>" +
      String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(ss).padStart(2,"0") + "</b>";
  });
}
if(document.querySelector("[data-countdown]")){ tick(); setInterval(tick, 1000); }

/* ---------- datos compartidos ---------- */
function allLatestDraws(){
  const out = [];
  (typeof LOTERIAS !== "undefined" ? LOTERIAS : []).forEach(lot => {
    lot.games.forEach(g => {
      const d0 = g.draws && g.draws[0];
      if(d0) out.push({ lot: lot.name, game: g.name, d: d0.d, n: d0.n });
    });
  });
  return out;
}
function normNums(str){
  return str.split(/[\s,;\-]+/).map(s => s.trim()).filter(Boolean)
    .map(s => s.length === 1 ? "0"+s : s);
}

/* ---------- verificador (verificador/index.html) ---------- */
const vForm = document.getElementById("verificadorForm");
if(vForm){
  vForm.addEventListener("submit", e => {
    e.preventDefault();
    const mine = normNums(document.getElementById("misNumeros").value);
    const box = document.getElementById("verificadorResultado");
    if(!mine.length){ box.innerHTML = '<p>Escribe al menos un número.</p>'; return; }
    const hits = [];
    allLatestDraws().forEach(r => {
      const found = mine.filter(x => r.n.includes(x));
      if(found.length) hits.push({ r, found });
    });
    if(!hits.length){
      box.className = "result-box miss";
      box.innerHTML = "<strong>Sin coincidencias</strong><p>Tus números ("+esc(mine.join(", "))+") no aparecen en los últimos sorteos publicados. ¡Suerte la próxima vez!</p>";
      return;
    }
    box.className = "result-box";
    let html = "<strong>¡Coincidencias encontradas! ("+hits.length+")</strong>";
    hits.forEach(h => {
      html += '<div style="margin-top:10px"><b>'+esc(h.r.lot)+" — "+esc(h.r.game)+'</b> <span style="color:#5b6b60">('+fmtDate(h.r.d)+")</span><br>";
      html += h.r.n.map(n => ballHTML(n, h.found.includes(n) ? "gold" : "")).join(" ") + "</div>";
    });
    html += '<p style="margin-top:10px;font-size:.85rem;color:#5b6b60">Verifica siempre tu jugada con el vendedor o la banca. LotoGana muestra resultados de referencia.</p>';
    box.innerHTML = html;
  });
}

/* ---------- sueños (suenos/index.html) ---------- */
const suenosInput = document.getElementById("suenosBuscar");
if(suenosInput && typeof SUENOS !== "undefined"){
  const list = document.getElementById("suenosLista");
  const numInput = document.getElementById("suenosNumero");
  const numOut = document.getElementById("suenosPorNumero");
  function render(q){
    q = (q||"").toLowerCase().trim();
    const rows = SUENOS.filter(s => !q || s.t.includes(q) || s.n === q.padStart(2,"0"))
      .map(s => '<div class="stat"><div class="n">'+esc(s.n)+'</div><div class="l">'+esc(s.t)+"</div></div>").join("");
    list.innerHTML = rows || '<p style="color:#5b6b60">Sin resultados para "'+esc(q)+'". Prueba con otra palabra.</p>';
  }
  suenosInput.addEventListener("input", () => render(suenosInput.value));
  if(numInput){
    numInput.addEventListener("input", () => {
      const v = numInput.value.trim().padStart(2,"0");
      const hits = SUENOS.filter(s => s.n === v).map(s => esc(s.t));
      numOut.innerHTML = hits.length ? "<b>"+esc(v)+"</b> significa: "+hits.join(", ") : "";
    });
  }
  render("");
}

/* ---------- números calientes/fríos (numeros/index.html) ---------- */
const statsBox = document.getElementById("statsBox");
if(statsBox){
  const freq = {};
  allLatestDraws().forEach(r => r.n.forEach(n => { freq[n] = (freq[n]||0)+1; }));
  const entries = Object.entries(freq).sort((a,b) => b[1]-a[1]);
  const hot = entries.slice(0,10), cold = entries.slice(-10).reverse();
  const card = (title, arr, sub) =>
    '<div class="card"><div class="card-head"><h3>'+title+'</h3></div><div class="card-body"><p class="sub">'+sub+'</p><div class="balls">'+
    arr.map(e => ballHTML(e[0])+'<span class="ball-label">×'+e[1]+"</span>").join("") +
    "</div></div></div>";
  statsBox.innerHTML =
    card("🔥 Números calientes", hot, "Los que más salieron en los últimos sorteos de todos los juegos.") +
    card("❄️ Números fríos", cold, "Los que menos han salido últimamente. Algunos jugadores los prefieren por probabilidad.");
  const note = document.getElementById("statsNote");
  if(note) note.textContent = "Basado en "+allLatestDraws().length+" sorteos recientes. La lotería es azar: ningún número tiene ventaja real.";
}

/* ---------- predicciones / pirámide (predicciones/index.html) ---------- */
const piramideBox = document.getElementById("piramideBox");
if(piramideBox){
  const trios = [];
  (typeof LOTERIAS !== "undefined" ? LOTERIAS : []).forEach(lot => {
    lot.games.forEach(g => {
      if(g.kind === "trio" && g.draws && g.draws[0] && g.draws[0].n.length >= 3)
        trios.push({ name: g.name, n: g.draws[0].n.slice(0,3) });
    });
  });
  const pick = trios.slice(0,6);
  let html = '<p class="sub">Pirámide generada con los últimos sorteos de quiniela. Solo entretenimiento: el azar no tiene memoria.</p><div class="pyramid">';
  pick.forEach((t, i) => {
    html += '<div class="row"><span class="ball-label" style="min-width:120px;text-align:right">'+esc(t.name)+"</span> " +
      t.n.map(n => ballHTML(n, i===0 ? "gold" : "")).join(" ") + "</div>";
  });
  html += "</div>";
  // cruces: combina 1ro de cada juego
  const cruz = pick.map(t => t.n[0]);
  html += '<h3 style="margin-top:14px">La cruz del día</h3><p class="sub">Primeros premios combinados:</p><div class="balls">' +
    cruz.map(n => ballHTML(n, "big")).join(" ") + "</div>";
  piramideBox.innerHTML = html;
}
})();
