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

## Despliegue

Sitio 100% estático: funciona en cualquier hosting (Netlify, Vercel,
GitHub Pages, cPanel). Solo sube el contenido del repo.

## Notas

- Contenido original en español; verificado contra sorteos publicados.
- Las predicciones y la charada se presentan como entretenimiento/tradición.
- Juego responsable: solo +18.
