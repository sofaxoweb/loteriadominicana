/* ==========================================================================
   LotoGana — Contenido editorial (SEO semántico)
   --------------------------------------------------------------------------
   Textos originales en español para cada lotería y juego. Edita libremente;
   `node tools/build.js` regenera las páginas con este contenido.
   ABOUT[lotId]      → introducción de la página de la lotería
   GUIDES[lotId/gameId] → guía detallada del juego (reemplaza la corta)
   MORE_FAQS[lotId]  → preguntas extra (se suman a las generadas)
   HOME_SECTIONS     → secciones de contenido para la portada
   TOOL_INTROS       → introducciones de las páginas de herramientas
   ========================================================================== */

const ABOUT = {
nacional: `<p>La <strong>Lotería Nacional</strong> es la lotería oficial del Estado dominicano y una de las más jugadas del país. Sus dos sorteos principales marcan el ritmo del día: <strong>Gana Más</strong> en la tarde y la <strong>Quiniela de la Noche</strong>, además del <strong>Pega 3 Más</strong>.</p><p>Cada sorteo extrae 3 números del 00 al 99. Los jugadores apuestan a la <em>quiniela</em> (los tres números en orden), al <em>palé</em> (dos números) o a la <em>tripleta</em>, y cobran en su banca o punto de venta presentando el ticket ganador. En LotoGana publicamos los números minutos después de cada extracción, con el historial y la cuenta regresiva del próximo sorteo.</p>`,

leidsa: `<p><strong>Leidsa</strong> (Lotería Electrónica Internacional Dominicana) es la casa de los grandes premios acumulados del país. Su juego estrella es el <strong>Loto</strong>, con un premio mínimo de 150 millones de pesos que crece sorteo tras sorteo, acompañado del <strong>Loto Pool</strong>, el <strong>Super Kino TV</strong> de 20 números, la <strong>Quiniela Palé</strong> y el <strong>Pega 3 Más</strong>.</p><p>Los sorteos de Leidsa se celebran en la noche y se transmiten por televisión. El Loto se juega eligiendo 6 números del 01 al 38 más el número Más (del 1 al 12): quien acierte los 6 más el Más se lleva el acumulado. Aquí verás cada resultado con sus bolos, el premio acumulado vigente y el horario del próximo sorteo.</p>`,

real: `<p>La <strong>Lotería Real</strong> es la lotería del mediodía dominicano: todos los días a las 12:55 PM se extraen sus números. Su juego principal es la <strong>Quiniela Real</strong> (3 números del 00 al 99), acompañada del <strong>Loto Real</strong> (6 números), el <strong>Loto Pool Real</strong> (4 números), la <strong>Nueva Yol Real</strong> y <strong>Tu Fecha Real</strong>, el número único del día.</p><p>Es una de las loterías con más seguidores en bancas y puntos de venta por su horario conveniente: al mediodía ya sabes si ganaste. En esta página encontrarás todos sus juegos con resultados del día, guías de cómo jugar cada uno y la cuenta regresiva.</p>`,

loteka: `<p><strong>Loteka</strong> anima las noches dominicanas con tres juegos: la <strong>Quiniela Loteka</strong> (3 números), el <strong>Mega Chance</strong> (5 números) y el <strong>Lotto Loteka</strong>, con premio mínimo acumulado de 100 millones de pesos.</p><p>El Lotto Loteka se juega con 6 números más el Extra y el Power, lo que multiplica las formas de ganar. Sus sorteos nocturnos lo convierten en uno de los favoritos para cerrar el día. Consulta aquí los últimos resultados, los premios acumulados y a qué hora es el próximo sorteo.</p>`,

"la-primera": `<p><strong>La Primera</strong> ofrece dos sorteos diarios de quiniela —al mediodía y en la noche— más el <strong>Lotto 5</strong>, su juego de 6 números con premios importantes.</p><p>La mecánica es la clásica de la quiniela dominicana: 3 números del 00 al 99, con premios por quiniela exacta, palé y tripleta. El Lotto 5 sube la apuesta con 6 bolos del 01 al 38. En LotoGana verás los resultados de ambos horarios apenas salen los números.</p>`,

"la-suerte": `<p><strong>La Suerte Dominicana</strong> celebra dos sorteos de quiniela al día: al mediodía (12:30 PM) y a las 6:00 PM. Dos oportunidades diarias de probar tu número de la suerte con 3 bolos del 00 al 99.</p><p>Su formato simple —quiniela, palé y tripleta— la hace ideal tanto para jugadores nuevos como para los de toda la vida. Revisa aquí los números ganadores de hoy y de ayer.</p>`,

lotedom: `<p><strong>Lotedom</strong> es conocido por su quiniela de la tarde y por <strong>El Quemaito Mayor</strong>, el número único más esperado del día: un solo bolo del 00 al 99 que concentra toda la emoción.</p><p>Si juegas al Quemaito, basta acertar ese único número para ganar. La Quiniela Lotedom sigue el formato tradicional de 3 números con premios por quiniela y palé. Resultados actualizados a diario en esta página.</p>`,

"new-york": `<p>La <strong>New York Lottery</strong> es seguida por miles de dominicanos, en la isla y en la diáspora. Sus sorteos <strong>Midday</strong> (tarde) y <strong>Evening</strong> (noche) extraen 3 números del 000 al 999 todos los días.</p><p>Aunque es una lotería estadounidense, su quiniela de 3 cifras es parte de la cultura de juego dominicana. Publicamos sus resultados con la hora local de cada sorteo para que no te pierdas ninguno.</p>`,

florida: `<p>La <strong>Florida Lottery</strong> celebra sus sorteos de 3 cifras al mediodía y en la noche, hora del este de EE. UU. Tres números del 000 al 999 definen a los ganadores de cada extracción.</p><p>Es una de las loterías americanas más consultadas desde República Dominicana. Aquí tienes sus últimos resultados con fecha y hora de cada sorteo.</p>`,

anguila: `<p><strong>Anguila</strong> es la lotería caribeña con más ritmo del día: <strong>cuatro sorteos diarios</strong> de quiniela (10:00 AM, 1:00 PM, 6:00 PM y 9:00 PM), cada uno con 3 números del 00 al 99.</p><p>Su frecuencia la hace favorita entre quienes juegan varias veces al día. En esta página verás los cuatro sorteos con sus resultados más recientes y la cuenta regresiva del próximo.</p>`,

"king-lottery": `<p><strong>King Lottery</strong> es la lotería de St. Maarten (SXM), con sorteos de quiniela al mediodía y en la noche. Tres números del 00 al 99 en cada extracción.</p><p>Muy seguida en la región del Caribe, sus resultados llegan a LotoGana minutos después de cada sorteo. Consulta el historial y el horario del próximo.</p>`,

texas: `<p>El <strong>Pick 3 de Texas</strong> se juega tres veces al día —mañana, mediodía y noche— con 3 números del 000 al 999. Los jugadores eligen entre jugar exacto (straight), en cualquier orden (box) o combinado.</p><p>Sus tres horarios lo convierten en una de las loterías americanas con más acción diaria. Aquí publicamos los tres sorteos con sus fechas.</p>`,

georgia: `<p>El <strong>Cash 3 de Georgia</strong> extrae 3 números del 000 al 999 al mediodía y en la noche. Es uno de los juegos de 3 cifras más populares del sureste de Estados Unidos.</p><p>Puedes jugar tus números en orden exacto o en cualquier orden, con premios según la modalidad. Resultados actualizados de ambos sorteos diarios.</p>`,

tennessee: `<p>El <strong>Cash 3 de Tennessee</strong> ofrece tres sorteos diarios —mañana, tarde y noche— con 3 números del 000 al 999 y varias formas de jugar: exacto, cualquier orden y combinaciones.</p><p>En LotoGana encontrarás los resultados de los tres horarios, para que verifiques tu jugada del día sin importar a qué hora jugaste.</p>`,

bolet: `<p>El <strong>Bolet de Haití</strong> es una tradición con <strong>seis sorteos al día</strong>, muy seguido en la zona fronteriza y por la diáspora haitiana en República Dominicana. Cada sorteo extrae 3 números del 00 al 99.</p><p>Sus horarios —9:30 AM, 10:30 AM, 11:30 AM, 5:30 PM, 6:30 PM y 7:30 PM— lo hacen uno de los juegos con más movimiento del Caribe. Publicamos los seis resultados a diario.</p>`
};

const GUIDES = {
/* ---------- Lotería Nacional ---------- */
"nacional/gana-mas": "El Gana Más extrae 3 números del 00 al 99 cada tarde. Puedes jugar a la <em>quiniela</em> (acertar los 3 números en el orden exacto, el premio mayor), al <em>palé</em> (2 de los 3 números, en cualquier orden de aparición) o a la <em>tripleta</em>. Los premios se pagan según la tabla oficial de la banca donde juegues; guarda siempre tu ticket, es tu único comprobante.",
"nacional/quiniela-noche": "El sorteo nocturno de la Nacional, todos los días a las 9:00 PM: 3 números del 00 al 99. Las jugadas válidas son quiniela (3 en orden), palé (2 números) y tripleta. Es el sorteo con más volumen de apuestas del país, así que verifica tu ticket con calma y confirma el resultado aquí minutos después de la extracción.",
"nacional/pega-3-mas": "El Pega 3 Más combina la emoción de la quiniela con premios por combinaciones: se extraen números del 00 al 99 y premia la quiniela exacta además de palés. Revisa la tabla de pagos de tu banca antes de jugar, porque los premios varían según el tipo de jugada y el monto apostado.",

/* ---------- Leidsa ---------- */
"leidsa/quiniela-pale": "La Quiniela Palé de Leidsa se sortea de lunes a sábado a las 8:55 PM con 3 números del 00 al 99. Su nombre lo dice: el <em>palé</em> (acertar 2 de los 3 números) es la jugada estrella, aunque también premia la quiniela exacta. Es uno de los sorteos nocturnos con más tradición en las bancas dominicanas.",
"leidsa/pega-3-mas": "Tres bolos del 00 al 99 en el sorteo nocturno de Leidsa. El Pega 3 Más premia la quiniela en orden y las combinaciones de palé. Al ser un sorteo televisado, los resultados quedan registrados oficialmente minutos después de la extracción.",
"leidsa/loto-pool": "El Loto Pool extrae 5 números del 01 al 38. Ganas con 5 aciertos (premio mayor), pero también hay premios por 4 y 3 aciertos, así que tu jugada tiene varias oportunidades. Elige tus 5 números o juega al azar con una jugada automática.",
"leidsa/super-kino": "El Super Kino TV extrae 20 números del 01 al 80: el cartón más grande de las loterías dominicanas. Mientras más números de tu selección coincidan con los 20 extraídos, mayor es el premio; el premio máximo es por acertar los 20. Ideal para quienes disfrutan jugadas con muchas combinaciones.",
"leidsa/loto": "El juego millonario de Leidsa: elige 6 números del 01 al 38 más el número <em>Más</em> (del 1 al 12). El premio mínimo acumulado es de <strong>150 millones de pesos</strong> y crece cada sorteo sin ganador. Sorteos miércoles y sábado a las 8:55 PM. Con el Súper Más (octavo número) puedes multiplicar tus premios.",

/* ---------- Lotería Real ---------- */
"real/quiniela-real": "La Quiniela Real es el sorteo del mediodía: todos los días a las 12:55 PM se extraen 3 números del 00 al 99. Quiniela exacta, palé y tripleta son las jugadas disponibles. Su horario la hace perfecta para quienes quieren saber el resultado antes de la tarde.",
"real/loto-real": "El Loto Real extrae 6 números del 01 al 38 en el sorteo del mediodía. Premia 6, 5 y 4 aciertos, así que incluso sin el premio mayor tu jugada puede ganar. Elige tus números de la suerte o deja que la banca genere una combinación al azar.",
"real/loto-pool-real": "Cuatro números del 00 al 99 con premios por 4, 3 y 2 aciertos. El Loto Pool Real ofrece más niveles de premio que la quiniela tradicional, lo que aumenta tus chances de cobrar algo en cada sorteo del mediodía.",
"real/nueva-yol": "La Nueva Yol Real sigue el formato clásico: 3 números del 00 al 99 a las 12:55 PM, con premios por quiniela, palé y tripleta. Una opción más dentro de la familia de sorteos del mediodía de la Real.",
"real/tu-fecha": "Tu Fecha Real es el juego más simple de la lotería dominicana: un solo número del 00 al 99. Si sale tu número, ganas. Muchos jugadores usan su fecha de cumpleaños, aniversario o el número de su sueño de la charada.",

/* ---------- Loteka ---------- */
"loteka/quiniela-loteka": "La Quiniela Loteka se sortea en la noche con 3 números del 00 al 99. Jugadas de quiniela, palé y tripleta con los pagos habituales de las bancas. Es el sorteo ideal para cerrar el día de juego.",
"loteka/mega-chance": "El Mega Chance extrae 5 números del 00 al 99, con premios por 5, 4 y 3 aciertos. Más números significan más combinaciones ganadoras posibles: una alternativa interesante a la quiniela de 3 para quienes buscan premios mayores.",
"loteka/lotto-loteka": "El Lotto Loteka es el juego millonario de la noche: 6 números más el <em>Extra</em> y el <em>Power</em>, con un premio mínimo acumulado de <strong>100 millones de pesos</strong>. Acertar los 6 números te acerca al gran acumulado; el Extra y el Power abren premios adicionales.",

/* ---------- La Primera ---------- */
"la-primera/quiniela": "La Quiniela de La Primera del mediodía: 3 números del 00 al 99 a las 12:00 PM. El formato tradicional dominicano —quiniela exacta, palé y tripleta— con resultados publicados al instante.",
"la-primera/quiniela-noche": "La versión nocturna, a las 8:00 PM: otros 3 números del 00 al 99 y una segunda oportunidad en el día para los seguidores de La Primera.",
"la-primera/lotto-5": "El Lotto 5 extrae 6 números del 01 al 38 en el sorteo nocturno. Premia 6, 5 y 4 aciertos. Si te gustan los juegos de más números con premios escalonados, este es el tuyo dentro de La Primera.",

/* ---------- La Suerte ---------- */
"la-suerte/quiniela": "La Quiniela de La Suerte del mediodía (12:30 PM): 3 números del 00 al 99 con premios por quiniela, palé y tripleta. Sencilla, rápida y con resultados al momento.",
"la-suerte/quiniela-6pm": "El sorteo de las 6:00 PM repite la fórmula: 3 números del 00 al 99. Dos chances al día con La Suerte Dominicana.",

/* ---------- Lotedom ---------- */
"lotedom/quiniela": "La Quiniela Lotedom de la tarde: 3 números del 00 al 99 con el formato clásico de quiniela, palé y tripleta. Resultados publicados minutos después de la extracción.",
"lotedom/quemaito": "El Quemaito Mayor es el número único más famoso del país: un solo bolo del 00 al 99. Lo juegas, sale tu número y ganas: así de directo. Muchos lo eligen según su sueño de la noche anterior.",

/* ---------- New York ---------- */
"new-york/tarde": "El sorteo Midday de Nueva York extrae 3 números del 000 al 999 cada tarde. En EE. UU. se juega como Numbers (exacto o en cualquier orden); en República Dominicana se sigue como quiniela de 3 cifras.",
"new-york/noche": "El sorteo Evening de Nueva York, en la noche: otros 3 números del 000 al 999. Cierra el día de la lotería neoyorquina que tantos dominicanos siguen.",

/* ---------- Florida ---------- */
"florida/tarde": "El sorteo Midday de la Florida: 3 números del 000 al 999 al mediodía, hora del este. Su Pick 3 es uno de los más estables y consultados del Caribe.",
"florida/noche": "El sorteo Evening de la Florida en la noche: 3 números del 000 al 999. Verifica aquí los resultados con su fecha y hora.",

/* ---------- Anguila ---------- */
"anguila/10am": "El primer sorteo del día en Anguila, a las 10:00 AM: 3 números del 00 al 99. Ideal para empezar la jornada de juego.",
"anguila/1pm": "Segundo sorteo del día, a la 1:00 PM: otros 3 números del 00 al 99 en la quiniela caribeña.",
"anguila/6pm": "Tercer sorteo, a las 6:00 PM: la quiniela de la tarde anguileña con 3 números del 00 al 99.",
"anguila/9pm": "El sorteo que cierra el día en Anguila, a las 9:00 PM: últimos 3 números del 00 al 99 de la jornada.",

/* ---------- King Lottery ---------- */
"king-lottery/dia": "La Quiniela Día de King Lottery (St. Maarten) al mediodía: 3 números del 00 al 99.",
"king-lottery/noche": "La Quiniela Noche de King Lottery: 3 números del 00 al 99 en el sorteo nocturno de SXM.",

/* ---------- Texas ---------- */
"texas/manana": "El Pick 3 de Texas en la mañana: 3 números del 000 al 999. Se puede jugar exacto (straight), en cualquier orden (box) o combinado (straight/box).",
"texas/mediodia": "El sorteo del mediodía del Pick 3 texano: otros 3 números del 000 al 999 con las mismas modalidades de juego.",
"texas/noche": "El sorteo nocturno cierra la triple jornada del Pick 3 de Texas con 3 números del 000 al 999.",

/* ---------- Georgia ---------- */
"georgia/dia": "El Cash 3 de Georgia al mediodía: 3 números del 000 al 999. Modalidades: exacto, cualquier orden y combinaciones con premios fijos.",
"georgia/noche": "El Cash 3 nocturno de Georgia: 3 números del 000 al 999 para cerrar el día.",

/* ---------- Tennessee ---------- */
"tennessee/manana": "El Cash 3 de Tennessee en la mañana: 3 números del 000 al 999, con juego exacto o en cualquier orden.",
"tennessee/tarde": "El sorteo de la tarde del Cash 3 de Tennessee: otros 3 números del 000 al 999.",
"tennessee/noche": "El sorteo nocturno completa la triple jornada del Cash 3 de Tennessee.",

/* ---------- Bolet ---------- */
"bolet/s1": "Primer sorteo del Bolet haitiano, 9:30 AM: 3 números del 00 al 99.",
"bolet/s2": "Segundo sorteo, 10:30 AM: otros 3 números del 00 al 99.",
"bolet/s3": "Tercer sorteo, 11:30 AM: 3 números del 00 al 99.",
"bolet/s4": "Cuarto sorteo, 5:30 PM: la jornada de la tarde arranca con 3 números del 00 al 99.",
"bolet/s5": "Quinto sorteo, 6:30 PM: otros 3 números del 00 al 99.",
"bolet/s6": "Sexto y último sorteo del día, 7:30 PM: últimos 3 números del Bolet."
};

const MORE_FAQS = {
nacional: [
  { q: "¿Cuánto cuesta jugar la Lotería Nacional?", a: "El costo depende de la jugada y de la banca: la quiniela, el palé y la tripleta tienen precios distintos. Pregunta la tabla de pagos en tu punto de venta antes de jugar." },
  { q: "¿Qué hago si gano en la Lotería Nacional?", a: "Guarda tu ticket en buen estado: es el único comprobante válido. Cobra en la misma banca donde jugaste dentro del plazo establecido; para premios mayores sigue el proceso oficial de la lotería." },
  { q: "¿Los resultados de LotoGana son oficiales?", a: "Publicamos los resultados minutos después de cada sorteo verificándolos con las fuentes oficiales. Sin embargo, el resultado oficial es el que certifica cada lotería: ante cualquier duda, confirma con tu banca." }
],
leidsa: [
  { q: "¿Qué días se sortea el Loto de Leidsa?", a: "El Loto se sortea los miércoles y sábados a las 8:55 PM. La Quiniela Palé, en cambio, se juega de lunes a sábado." },
  { q: "¿Qué es el número Más del Loto?", a: "Es un número adicional del 1 al 12 que se extrae junto a los 6 principales. Acertar los 6 números más el Más es lo que te lleva al premio acumulado de 150 millones." },
  { q: "¿Cómo reclamo un premio grande de Leidsa?", a: "Los premios mayores se reclaman por el proceso oficial de Leidsa con tu ticket original. Los premios menores se cobran directamente en la banca." }
],
real: [
  { q: "¿La Lotería Real sortea todos los días?", a: "Sí: sus sorteos del mediodía (12:55 PM) se celebran de lunes a domingo, incluyendo fines de semana y feriados." },
  { q: "¿Qué es Tu Fecha Real?", a: "Es el juego de un solo número del 00 al 99. Muchos jugadores usan su fecha de cumpleaños o el número de su sueño." }
],
loteka: [
  { q: "¿Cuál es el premio mínimo del Lotto Loteka?", a: "El premio mínimo acumulado es de 100 millones de pesos, y crece con cada sorteo sin ganador del premio mayor." },
  { q: "¿Qué son el Extra y el Power del Lotto Loteka?", a: "Son dos números adicionales que se extraen con los 6 principales y abren categorías de premios extra más allá del acumulado." }
],
"la-primera": [
  { q: "¿Cuántos sorteos diarios tiene La Primera?", a: "Tres: la quiniela del mediodía (12:00 PM), la quiniela de la noche (8:00 PM) y el Lotto 5 (8:00 PM)." }
],
"la-suerte": [
  { q: "¿A qué horas sortea La Suerte?", a: "Dos veces al día: 12:30 PM y 6:00 PM, todos los días." }
],
lotedom: [
  { q: "¿Cómo se gana El Quemaito Mayor?", a: "Es un solo número del 00 al 99: si tu número coincide con el extraído, ganas. Sin combinaciones ni segundos premios." }
],
"new-york": [
  { q: "¿A qué hora son los sorteos de New York en hora dominicana?", a: "El Midday es en la tarde y el Evening en la noche, hora del este (misma zona horaria que República Dominicana la mayor parte del año)." }
],
florida: [
  { q: "¿La Florida Lottery es oficial en RD?", a: "Es la lotería oficial del estado de Florida, EE. UU. En República Dominicana se sigue como referencia: no se venden tickets oficiales aquí, solo se publican sus resultados." }
],
anguila: [
  { q: "¿Cuántos sorteos diarios tiene Anguila?", a: "Cuatro: 10:00 AM, 1:00 PM, 6:00 PM y 9:00 PM, todos de quiniela con 3 números del 00 al 99." }
],
"king-lottery": [
  { q: "¿Qué es SXM en King Lottery?", a: "SXM es el código de St. Maarten (Sint Maarten), la isla caribeña donde se celebra esta lotería." }
],
texas: [
  { q: "¿Qué significa jugar 'box' en el Pick 3 de Texas?", a: "Significa que tus 3 números pueden salir en cualquier orden. Paga menos que el 'straight' (orden exacto) pero es más fácil acertar." }
],
georgia: [
  { q: "¿El Cash 3 de Georgia paga premios fijos?", a: "Sí: sus premios son fijos según la modalidad jugada (exacto, cualquier orden o combinado), no dependen de un acumulado." }
],
tennessee: [
  { q: "¿Cuántas veces al día sortea Tennessee?", a: "Tres: mañana (10:20 AM), tarde (1:20 PM) y noche (7:20 PM)." }
],
bolet: [
  { q: "¿El Bolet es una lotería dominicana?", a: "No: es la lotería tradicional de Haití, pero es muy jugada y seguida en República Dominicana, especialmente en la zona fronteriza." }
]
};

const HOME_SECTIONS = `
  <div class="section">
    <h2>Guía de loterías dominicanas</h2>
    <p class="sub">Todo lo que necesitas saber para jugar y verificar resultados</p>
    <div class="card"><div class="card-body">
      <h3 style="margin-bottom:8px">¿Cómo leer los resultados?</h3>
      <p>Cada juego muestra sus <strong>números ganadores</strong> como bolos, la <strong>fecha del sorteo</strong> y la <strong>cuenta regresiva</strong> del próximo. En las quinielas verás etiquetas <em>1ro, 2do y 3ro</em>: el orden en que salieron los números. En juegos como el Loto verás además el número <em>Más</em> (dorado) y el premio acumulado vigente.</p>
      <h3 style="margin:14px 0 8px">Las loterías más jugadas del país</h3>
      <p>La <strong>Lotería Nacional</strong> (Gana Más y Quiniela Noche), <strong>Leidsa</strong> (Loto millonario y Quiniela Palé), la <strong>Real</strong> del mediodía, <strong>Loteka</strong>, <strong>La Primera</strong>, <strong>La Suerte</strong> y <strong>Lotedom</strong> con su Quemaito Mayor: las siete grandes dominicanas están aquí, con sus horarios y resultados del día. También cubrimos las internacionales más seguidas: <strong>New York, Florida, Anguila, King Lottery (SXM), Texas, Georgia, Tennessee</strong> y el <strong>Bolet haitiano</strong>.</p>
      <h3 style="margin:14px 0 8px">Juega responsablemente</h3>
      <p>La lotería es entretenimiento, no una inversión. Define un presupuesto fijo, juega solo en bancas autorizadas y nunca apuestes dinero que necesites. Solo para mayores de 18 años. Si sientes que el juego se sale de control, busca ayuda profesional.</p>
    </div></div>
  </div>`;

const TOOL_INTROS = {
verificador: `<p class="sub">No busques más número por número: escribe tu jugada y la comparamos con el último sorteo de cada juego.</p>`,
suenos: `<p class="sub">En República Dominicana, soñar no es solo soñar: cada sueño tiene su número en la charada. Busca el tuyo aquí.</p>`,
numeros: `<p class="sub">¿Qué números están saliendo más? Mira las estadísticas antes de armar tu jugada.</p>`,
predicciones: `<p class="sub">Pirámide y cruz generadas con los últimos sorteos. Recuerda: es entretenimiento, el azar no tiene memoria.</p>`
};
