/* ==========================================================================
   LotoGana — Base de datos de resultados
   --------------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE DEBES EDITAR PARA ACTUALIZAR RESULTADOS.

   - Agrega el sorteo nuevo ARRIBA de la lista `draws` (el más reciente primero).
   - d = fecha en formato AAAA-MM-DD. n = números como strings de 2 dígitos.
   - kind: "trio" (1ro/2do/3ro) · "balls" (bolos) · "single" (1 número)
           "loto" (6 + bonus) · "power" (5 + especial)
   - days: días de sorteo (0=domingo … 6=sábado). Si se omite = todos los días.
   ========================================================================== */

const SITE = {
  name: "LotoGana",
  tagline: "Resultados de loterías dominicanas al instante",
  updated: "2026-10-11",
  description: "Resultados al instante de los sorteos de loterías dominicanas: Lotería Nacional, Leidsa, Real, Loteka, La Primera, La Suerte, Lotedom, New York, Florida, Anguila, King Lottery y más. Horarios, cuenta regresiva, verificador de jugadas, sueños, números calientes y predicciones."
};

const LOTERIAS = [
  {
    id: "nacional", name: "Lotería Nacional", color: "#1d4ed8", country: "do",
    desc: "La lotería oficial del Estado dominicano. Gana Más y Juega Más Pega Más en la tarde, la Quiniela de la Noche y el sorteo dominical de Billetes y Quinielas.",
    games: [
      { id: "gana-mas", name: "Gana Más", time: "14:30", kind: "trio",
        guide: "Se extraen 3 números del 00 al 99. Ganas con quiniela (los 3 en orden), palé (2) o tripleta según tu jugada.",
        draws: [ { d: "2026-10-10", n: ["10","35","35"] } ] },
      { id: "quiniela-noche", name: "Quiniela Noche", time: "21:00", kind: "trio",
        guide: "El sorteo nocturno de la Nacional: 3 números del 00 al 99, todos los días a las 9:00 PM.",
        draws: [ { d: "2026-10-10", n: ["30","47","97"] } ] },
      { id: "juega-mas-pega-mas", name: "Juega Más Pega Más", time: "14:30", kind: "balls",
        guide: "Cinco números de tres tómbolas (azul, roja y blanca). El premio mayor es por acertar los 5; también premian 4, 3 y 2 aciertos.",
        draws: [ { d: "2026-10-10", n: ["05","08","04","18","21"] } ] },
      { id: "billetes-quinielas", name: "Billetes y Quinielas", time: "18:00", days: [0], kind: "billete",
        guide: "Sorteo especial de los domingos: 3 premios principales de 6 cifras (1ro, 2do y 3ro). Juegas con tu billete impreso.",
        draws: [ { d: "2026-09-27", n: ["326883","378130","382173"] } ] }
    ]
  },
  {
    id: "leidsa", name: "Leidsa", color: "#0e7c4a", country: "do",
    desc: "Lotería Electrónica Internacional Dominicana. Famosa por el Loto y sus premios millonarios acumulados, además de la Quiniela Palé nocturna.",
    games: [
      { id: "quiniela-pale", name: "Quiniela Palé", time: "20:55", altTimes: { 0: "15:55" }, kind: "trio",
        guide: "Tres números del 00 al 99: lunes a sábado a las 8:55 PM, domingos a las 3:55 PM. El palé paga al acertar 2 de los 3 números.",
        draws: [ { d: "2026-10-10", n: ["47","55","19"] } ] },
      { id: "pega-3-mas", name: "Pega 3 Más", time: "20:55", altTimes: { 0: "15:55" }, kind: "trio",
        guide: "Tres bolos del 00 al 99 en el sorteo nocturno de Leidsa.",
        draws: [ { d: "2026-10-10", n: ["12","31","39"] } ] },
      { id: "loto-pool", name: "Loto Pool", time: "20:55", altTimes: { 0: "15:55" }, kind: "balls",
        guide: "Cinco números del 01 al 38. Gana quien acierte los 5; también premian 4 y 3 aciertos.",
        draws: [ { d: "2026-10-10", n: ["03","05","13","18","30"] } ] },
      { id: "super-kino", name: "Super Kino TV", time: "20:55", altTimes: { 0: "15:55" }, kind: "balls",
        guide: "Veinte números del 01 al 80. Mientras más aciertos, mayor el premio; el premio mayor es por los 20.",
        draws: [ { d: "2026-10-10", n: ["09","10","11","12","23","28","31","33","35","39","40","41","44","49","59","68","75","76","82","84"] } ] },
      { id: "loto", name: "Loto · Loto Más", time: "20:55", days: [3,6], kind: "loto", jackpot: "$150,000,000",
        guide: "Seis números del 01 al 38 más el número Más (1-12). El premio mínimo acumulado es de 150 millones de pesos. Miércoles y sábado.",
        draws: [ { d: "2026-10-10", n: ["12","20","22","26","30","40"], bonus: "01", super: "07" } ] }
    ]
  },
  {
    id: "real", name: "Lotería Real", color: "#b45309", country: "do",
    desc: "Sorteos del mediodía dominicano: la Quiniela Real y sus juegos hermanos se juegan todos los días a las 12:55 PM.",
    games: [
      { id: "quiniela-real", name: "Quiniela Real", time: "12:55", kind: "trio",
        guide: "El sorteo del mediodía: 3 números del 00 al 99, de lunes a domingo a las 12:55 PM.",
        draws: [ { d: "2026-10-10", n: ["23","93","24"] } ] },
      { id: "loto-real", name: "Loto Real", time: "12:55", days: [2,5], kind: "balls",
        guide: "Seis números del 01 al 38 en el sorteo del mediodía de la Real. Martes y viernes.",
        draws: [ { d: "2026-10-09", n: ["03","11","18","19","25","26"] } ] },
      { id: "loto-pool-real", name: "Loto Pool Real", time: "12:55", kind: "balls",
        guide: "Cuatro números del 00 al 99. Premia 4, 3 y 2 aciertos.",
        draws: [ { d: "2026-10-10", n: ["08","47","34","11"] } ] },
      { id: "nueva-yol", name: "Nueva Yol Real", time: "12:55", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo del mediodía.",
        draws: [ { d: "2026-10-10", n: ["08","54","28"] } ] },
      { id: "tu-fecha", name: "Tu Fecha Real", time: "12:55", kind: "single",
        guide: "Un solo número del 00 al 99: tu fecha de la suerte del día.",
        draws: [ { d: "2026-10-10", n: ["25"] } ] },
      { id: "pega-4-real", name: "Pega 4 Real", time: "12:55", kind: "balls",
        guide: "Cuatro números del 00 al 99 con premios por 4, 3 y 2 aciertos en el sorteo del mediodía.",
        draws: [ ] }
    ]
  },
  {
    id: "loteka", name: "Loteka", color: "#7c3aed", country: "do",
    desc: "La lotería de la tarde-noche: Quiniela Loteka, Mega Chance y Lotto Loteka con premios millonarios.",
    games: [
      { id: "quiniela-loteka", name: "Quiniela Loteka", time: "19:55", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo nocturno de Loteka.",
        draws: [ { d: "2026-10-10", n: ["77","02","13"] } ] },
      { id: "mega-chance", name: "Mega Chance", time: "19:55", kind: "balls",
        guide: "Cinco números del 00 al 99. Premia 5, 4 y 3 aciertos.",
        draws: [ { d: "2026-10-10", n: ["35","95","41","91","62"] } ] },
      { id: "lotto-loteka", name: "Lotto Loteka", time: "19:55", days: [1,4], kind: "power", jackpot: "$100,000,000",
        guide: "Seis números más el Extra y el Power. Premio mínimo de 100 millones de pesos. Lunes y jueves.",
        draws: [ { d: "2026-10-08", n: ["06","09","18","31","32","35"], bonus: "01", super: "09" } ] }
    ]
  },
  {
    id: "la-primera", name: "La Primera", color: "#0284c7", country: "do",
    desc: "Los sorteos de La Primera al mediodía y en la noche, incluyendo el Lotto 5.",
    games: [
      { id: "quiniela", name: "Quiniela La Primera", time: "12:00", kind: "trio",
        guide: "Tres números del 00 al 99 al mediodía.",
        draws: [ { d: "2026-10-10", n: ["64","40","06"] } ] },
      { id: "quiniela-noche", name: "Quiniela La Primera Noche", time: "20:00", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo de las 8:00 PM.",
        draws: [ { d: "2026-10-10", n: ["89","92","84"] } ] },
      { id: "lotto-5", name: "Lotto 5", time: "20:00", kind: "balls",
        guide: "Seis números del 01 al 38. El premio mayor es por acertar los 6.",
        draws: [ { d: "2026-10-10", n: ["02","14","17","20","27","01"] } ] }
    ]
  },
  {
    id: "la-suerte", name: "La Suerte", color: "#db2777", country: "do",
    desc: "La Suerte Dominicana con dos sorteos diarios de quiniela: al mediodía y a las 6 de la tarde.",
    games: [
      { id: "quiniela", name: "Quiniela La Suerte", time: "12:30", kind: "trio",
        guide: "Tres números del 00 al 99 al mediodía.",
        draws: [ { d: "2026-10-10", n: ["12","34","72"] } ] },
      { id: "quiniela-6pm", name: "Quiniela La Suerte 6PM", time: "18:00", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo de las 6:00 PM.",
        draws: [ { d: "2026-10-10", n: ["57","46","15"] } ] }
    ]
  },
  {
    id: "lotedom", name: "Lotedom", color: "#65a30d", country: "do",
    desc: "Lotedom: la Quiniela del mediodía, El Quemaito Mayor y Agarra 4, con resultados todos los días.",
    games: [
      { id: "quiniela", name: "Quiniela Lotedom", time: "12:00", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo del mediodía.",
        draws: [ { d: "2026-10-10", n: ["58","72","09"] } ] },
      { id: "quemaito", name: "El Quemaito Mayor", time: "12:00", kind: "single",
        guide: "Un solo número del 00 al 99: el más caliente del día.",
        draws: [ { d: "2026-10-10", n: ["06"] } ] },
      { id: "agarra-4", name: "Agarra 4", time: "12:00", kind: "balls",
        guide: "Cuatro números del 00 al 99 en el sorteo del mediodía de Lotedom.",
        draws: [ { d: "2026-10-11", n: ["94","78","49","69"] } ] }
    ]
  },
  {
    id: "new-york", name: "New York Lottery", color: "#475569", country: "int",
    desc: "Los números ganadores de la lotería de Nueva York, seguidos a diario por miles de dominicanos.",
    games: [
      { id: "tarde", name: "New York Tarde", time: "14:30", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo de la tarde (Midday).",
        draws: [ { d: "2026-10-10", n: ["06","62","64"] } ] },
      { id: "noche", name: "New York Noche", time: "22:30", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo nocturno (Evening).",
        draws: [ { d: "2026-10-10", n: ["23","83","44"] } ] }
    ]
  },
  {
    id: "florida", name: "Florida Lottery", color: "#ea580c", country: "int",
    desc: "Resultados de la Florida Lottery en sus sorteos de la tarde y de la noche.",
    games: [
      { id: "tarde", name: "Florida Tarde", time: "13:30", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo del mediodía (Midday).",
        draws: [ { d: "2026-10-10", n: ["44","35","47"] } ] },
      { id: "noche", name: "Florida Noche", time: "21:45", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo nocturno (Evening).",
        draws: [ { d: "2026-10-10", n: ["52","37","53"] } ] }
    ]
  },
  {
    id: "anguila", name: "Anguila", color: "#0f766e", country: "int",
    desc: "La lotería caribeña de Anguila con cuatro sorteos diarios de quiniela.",
    games: [
      { id: "10am", name: "Anguila 10AM", time: "10:00", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo de las 10:00 AM.",
        draws: [ { d: "2026-10-10", n: ["74","11","05"] } ] },
      { id: "1pm", name: "Anguila 1PM", time: "13:00", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo de la 1:00 PM.",
        draws: [ { d: "2026-10-10", n: ["14","13","33"] } ] },
      { id: "6pm", name: "Anguila 6PM", time: "18:00", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo de las 6:00 PM.",
        draws: [ { d: "2026-10-10", n: ["61","07","01"] } ] },
      { id: "9pm", name: "Anguila 9PM", time: "21:00", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo de las 9:00 PM.",
        draws: [ { d: "2026-10-10", n: ["12","53","53"] } ] }
    ]
  },
  {
    id: "king-lottery", name: "King Lottery (SXM)", color: "#9333ea", country: "int",
    desc: "King Lottery de St. Maarten: quinielas del día y de la noche.",
    games: [
      { id: "dia", name: "SXM Quiniela Día", time: "12:30", kind: "trio",
        guide: "Tres números del 00 al 99 al mediodía.",
        draws: [ { d: "2026-10-10", n: ["07","97","94"] } ] },
      { id: "noche", name: "SXM Quiniela Noche", time: "19:30", kind: "trio",
        guide: "Tres números del 00 al 99 en el sorteo nocturno.",
        draws: [ { d: "2026-10-10", n: ["84","46","25"] } ] }
    ]
  },
  {
    id: "texas", name: "Texas Lottery", color: "#92400e", country: "int",
    desc: "Pick 3 de Texas con tres sorteos al día: mañana, mediodía y noche.",
    games: [
      { id: "manana", name: "Texas Mañana", time: "10:00", days: [1,2,3,4,5,6], kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo de la mañana (lunes a sábado).",
        draws: [ { d: "2026-10-09", n: ["67","88","81"] } ] },
      { id: "mediodia", name: "Texas Mediodía", time: "12:27", days: [1,2,3,4,5,6], kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo del mediodía (lunes a sábado).",
        draws: [ { d: "2026-10-09", n: ["17","26","00"] } ] },
      { id: "noche", name: "Texas Noche", time: "18:00", days: [1,2,3,4,5,6], kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo nocturno (lunes a sábado).",
        draws: [ { d: "2026-10-09", n: ["83","36","83"] } ] }
    ]
  },
  {
    id: "georgia", name: "Georgia Lottery", color: "#4f46e5", country: "int",
    desc: "Cash 3 de Georgia al mediodía y en la noche.",
    games: [
      { id: "dia", name: "Georgia Mediodía", time: "12:29", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo del mediodía.",
        draws: [ { d: "2026-10-09", n: ["92","06","93"] } ] },
      { id: "noche", name: "Georgia Noche", time: "18:59", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo nocturno.",
        draws: [ { d: "2026-10-09", n: ["18","22","71"] } ] }
    ]
  },
  {
    id: "tennessee", name: "Tennessee Lottery", color: "#0891b2", country: "int",
    desc: "Cash 3 de Tennessee con sorteos en la mañana, la tarde y la noche.",
    games: [
      { id: "manana", name: "Tennessee Mañana", time: "10:20", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo de la mañana.",
        draws: [ { d: "2026-10-09", n: ["90","61","51"] } ] },
      { id: "tarde", name: "Tennessee Tarde", time: "13:20", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo de la tarde.",
        draws: [ { d: "2026-10-09", n: ["87","55","66"] } ] },
      { id: "noche", name: "Tennessee Noche", time: "19:20", kind: "trio",
        guide: "Tres números del 000 al 999 en el sorteo nocturno.",
        draws: [ { d: "2026-10-02", n: ["20","51","38"] } ] }
    ]
  },
  {
    id: "bolet", name: "Bolet (Haití)", color: "#166534", country: "int",
    desc: "El Bolet de Haití con seis sorteos diarios, muy seguido en la frontera y la diáspora.",
    games: [
      { id: "s1", name: "Bolet 9:30 AM", time: "09:30", kind: "trio", guide: "Tres números del 00 al 99.", draws: [ { d: "2026-10-10", n: ["79","38","56"] } ] },
      { id: "s2", name: "Bolet 10:30 AM", time: "10:30", kind: "trio", guide: "Tres números del 00 al 99.", draws: [ { d: "2026-10-10", n: ["99","65","50"] } ] },
      { id: "s3", name: "Bolet 11:30 AM", time: "11:30", kind: "trio", guide: "Tres números del 00 al 99.", draws: [ { d: "2026-10-10", n: ["79","39","45"] } ] },
      { id: "s4", name: "Bolet 5:30 PM", time: "17:30", kind: "trio", guide: "Tres números del 00 al 99.", draws: [ { d: "2026-10-09", n: ["09","01","83"] } ] },
      { id: "s5", name: "Bolet 6:30 PM", time: "18:30", kind: "trio", guide: "Tres números del 00 al 99.", draws: [ { d: "2026-10-09", n: ["16","23","59"] } ] },
      { id: "s6", name: "Bolet 7:30 PM", time: "19:30", kind: "trio", guide: "Tres números del 00 al 99.", draws: [ { d: "2026-10-09", n: ["77","75","39"] } ] }
    ]
  }
];

/* Loterías americanas con premios acumulados (solo portada) */
const AMERICANAS = [
  { name: "Mega Millions", kind: "power", time: "23:00", days: [2,5], jackpot: "$385,000,000",
    guide: "Cinco números del 1 al 70 más la Mega Ball. Sorteos martes y viernes.",
    draws: [ { d: "2026-10-09", n: ["02","07","16","63","70"], bonus: "08" } ] },
  { name: "Powerball", kind: "power", time: "22:59", days: [1,3,6], jackpot: "$519,200,000",
    guide: "Cinco números del 1 al 69 más la Powerball. Sorteos lunes, miércoles y sábado.",
    draws: [ { d: "2026-10-10", n: ["01","04","19","33","51"], bonus: "15", extra: "2X" } ] }
];

/* --------------------------------------------------------------------------
   SUEÑOS — Charada tradicional dominicana (palabra → número).
   Tabla de referencia popular; se muestra como entretenimiento cultural.
-------------------------------------------------------------------------- */
const SUENOS = [
  { t: "agua", n: "01" }, { t: "niño", n: "02" }, { t: "santo", n: "03" },
  { t: "gato", n: "04" }, { t: "fuego", n: "05" }, { t: "perro", n: "06" },
  { t: "revólver", n: "07" }, { t: "muerto", n: "08" }, { t: "elefante", n: "09" },
  { t: "pescado", n: "10" }, { t: "pájaro", n: "11" }, { t: "soldado", n: "12" },
  { t: "niña", n: "13" }, { t: "borracho", n: "14" }, { t: "boda", n: "15" },
  { t: "toro", n: "16" }, { t: "luna", n: "17" }, { t: "iglesia", n: "18" },
  { t: "mesa", n: "19" }, { t: "paloma", n: "20" }, { t: "tren", n: "21" },
  { t: "zapato", n: "22" }, { t: "cocodrilo", n: "23" }, { t: "ratón", n: "24" },
  { t: "mariposa", n: "25" }, { t: "piedra", n: "26" }, { t: "araña", n: "27" },
  { t: "mono", n: "28" }, { t: "venado", n: "29" }, { t: "tigre", n: "30" },
  { t: "caballo", n: "31" }, { t: "dinero", n: "32" }, { t: "cárcel", n: "33" },
  { t: "lluvia", n: "34" }, { t: "avión", n: "35" }, { t: "serpiente", n: "36" },
  { t: "árbol", n: "37" }, { t: "llave", n: "38" }, { t: "hospital", n: "39" },
  { t: "cama", n: "40" }, { t: "madre", n: "41" }, { t: "padre", n: "42" },
  { t: "bebé", n: "43" }, { t: "fiesta", n: "44" }, { t: "reloj", n: "45" },
  { t: "anillo", n: "46" }, { t: "espejo", n: "47" }, { t: "puerta", n: "48" },
  { t: "carro", n: "49" }, { t: "gallo", n: "50" }, { t: "flor", n: "51" },
  { t: "río", n: "52" }, { t: "montaña", n: "53" }, { t: "playa", n: "54" },
  { t: "cuchillo", n: "55" }, { t: "sombrero", n: "56" }, { t: "camisa", n: "57" },
  { t: "pantalón", n: "58" }, { t: "silla", n: "59" }, { t: "televisor", n: "60" },
  { t: "teléfono", n: "61" }, { t: "libro", n: "62" }, { t: "escuela", n: "63" },
  { t: "maestro", n: "64" }, { t: "doctor", n: "65" }, { t: "policía", n: "66" },
  { t: "juez", n: "67" }, { t: "abogado", n: "68" }, { t: "casa", n: "69" },
  { t: "cocina", n: "70" }, { t: "baño", n: "71" }, { t: "dormitorio", n: "72" },
  { t: "jardín", n: "73" }, { t: "perro bravo", n: "74" }, { t: "gallina", n: "75" },
  { t: "pato", n: "76" }, { t: "conejo", n: "77" }, { t: "oveja", n: "78" },
  { t: "vaca", n: "79" }, { t: "cerdo", n: "80" }, { t: "chivo", n: "81" },
  { t: "burro", n: "82" }, { t: "mula", n: "83" }, { t: "tortuga", n: "84" },
  { t: "cangrejo", n: "85" }, { t: "tiburón", n: "86" }, { t: "ballena", n: "87" },
  { t: "delfín", n: "88" }, { t: "pulpo", n: "89" }, { t: "camarón", n: "90" },
  { t: "oro", n: "91" }, { t: "plata", n: "92" }, { t: "diamante", n: "93" },
  { t: "corona", n: "94" }, { t: "castillo", n: "95" }, { t: "príncipe", n: "96" },
  { t: "reina", n: "97" }, { t: "rey", n: "98" }, { t: "ángel", n: "99" },
  { t: "dios", n: "00" }
];
