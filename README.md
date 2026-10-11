# LotoGana — Resultados de loterías dominicanas

Sitio estático (HTML/CSS/JS puro, sin build step) con resultados de loterías
dominicanas e internacionales, inspirado en los grandes portales de resultados
pero con diseño, contenido y marca 100% originales.

## Estructura

```
index.html                  Portada: todos los resultados de hoy
loteria/index.html          Directorio de las 15 loterías
loteria/<id>/index.html     Página de cada lotería (15), generada
verificador/                ¿Ganaste? Compara tus números con los últimos sorteos
suenos/                     Charada dominicana: busca tu sueño → número
numeros/                    Números calientes y fríos (estadísticas)
predicciones/               Pirámide y cruz del día (entretenimiento)
nosotros/ · contacto/ · privacidad/
assets/
  data.js                   ⭐ ÚNICO ARCHIVO A EDITAR para actualizar resultados
  app.js                    Cuenta regresiva, verificador, sueños, stats, pirámide
  styles.css                Diseño completo
  logo.svg                  Logo original
tools/build.js              Generador de páginas de lotería + portada
```

## Actualizar resultados (2 minutos)

1. Abre `assets/data.js`.
2. Busca el juego (ej. `"quiniela-real"`) y agrega el sorteo **arriba** de `draws`:
   ```js
   draws: [ { d: "2026-10-12", n: ["11","22","33"] }, ... ]
   ```
3. Ejecuta `node tools/build.js` para regenerar las páginas.
4. Sube los cambios (`git add -A && git commit -m "resultados 12-oct" && git push`).

Formato de números: strings de 2 dígitos (`"07"`). `kind` puede ser
`"trio"` (1ro/2do/3ro), `"balls"`, `"single"`, `"loto"` (6+bonus) o
`"power"` (5+especial). `bonus`/`super`/`jackpot` son opcionales.

## Actualización automática (scraper)

`tools/scraper/` contiene el sistema de actualización automática:

- **Fuentes**: loteriadominicana.com.do (principal, ~30 juegos) y
  sorteosrd.com (secundaria: páginas de Real, Leidsa y Nacional).
- **Verificación cruzada** (`verify.js`): un juego presente en ambas fuentes
  solo se publica si números y fecha coinciden exactamente (comparación
  insensible al orden de los bolos). Si hay conflicto, **no se publica**
  y se genera una alerta.
- **Juegos de una sola fuente** se publican marcados como tales.
- **GitHub Actions** (`.github/workflows/scrape.yml`) lo ejecuta cada
  30 minutos en horario de sorteos (10:00–23:30 hora RD): actualiza
  `data.js`, regenera las páginas y hace commit+push solo si hubo cambios.
- Si algo falla o hay conflictos, abre un **issue** automático con el detalle.

```bash
node tools/scraper/test.js                          # tests (6 grupos)
node tools/scraper/run.js --fixtures=tools/scraper/fixtures --dry  # prueba sin escribir
node tools/scraper/run.js                           # ejecución real
```

Para agregar un juego nuevo: añádelo a `assets/data.js` (con `draws: []`
si aún no hay resultados) y su mapeo en `tools/scraper/mapping.js`.

## Despliegue

Sitio 100% estático: funciona en cualquier hosting (Netlify, Vercel,
GitHub Pages, cPanel). Solo sube el contenido del repo.

## Notas

- Contenido original en español; verificado contra sorteos publicados.
- Las predicciones y la charada se presentan como entretenimiento/tradición.
- Juego responsable: solo +18.
