# Personalizar tu viaje

Todo el contenido del viaje está en [`src/data/trip.ts`](../src/data/trip.ts). Este documento explica cada parte. Mientras editas, deja `npm run dev` abierto para ver los cambios al momento y ejecuta `npm test` al terminar: valida que los datos sean coherentes.

> Lo que pongas en `trip.ts` se publica con la web. Los códigos de reserva, enlaces privados o datos personales guárdalos desde la pestaña **Reservas** de la propia web, que solo los guarda en tu navegador.

## 1. Datos generales: `TRIP`

```ts
export const TRIP: TripConfig = {
  id: "japan-trip", // prefijo del almacenamiento local: cámbialo si tienes varias guías en el mismo dominio
  lang: "es", // idioma en el que escribes los textos de este archivo: es, ca, en o fr
  title: "Japón 2027", // título de la pestaña y del calendario
  titleJa: "日本 2027", // texto de la barra superior
  travellers: ["Alex", "Sam"], // dos personas: los gastos compartidos se reparten a medias
  start: "2027-11-10", // fecha del primer día (día 0)
  end: "2027-11-29",
  home: { code: "MAD", city: "Madrid", timeZone: "Europe/Madrid" }, // reloj doble y cuenta atrás
  yenPerEur: 160, // cambio para mostrar precios en euros
  pace: "…",
  luggage: "…",
  welcome: { … }, // mensaje del primer arranque; bórralo si no lo quieres
};
```

`home.timeZone` es un identificador IANA (`Europe/Madrid`, `America/Mexico_City`, `America/Bogota`…).

El mensaje de bienvenida se muestra una vez por dispositivo. Para verlo de nuevo abre la web con `?bienvenida=1`.

## 2. Vuelos: `FLIGHTS`

El primer vuelo es la ida: su fecha, hora y ciudad de salida alimentan la cuenta atrás. La fecha de llegada del último vuelo se marca en el calendario como vuelta a casa.

## 3. Bloques: `BLOCKS`

Los bloques agrupan días seguidos (por ejemplo, "Tokio" o "Kioto y Osaka") y dan color al calendario, al mapa y a la línea de días. El `id` es el que usan los días y las estancias en su campo `block`.

Cada bloque toma un color de la paleta del tema según su posición (el primero, `--c-1`; el segundo, `--c-2`…, y a partir del quinto se repiten). Puedes usar los `id` que quieras; para cambiar los colores, edita `--c-1` a `--c-4` en las tres variantes de tema de `src/styles.css`.

## 4. Días: `DAYS`

Cada día tiene un número `n` (desde 0, consecutivo) y una fecha (seguida a la del día anterior). El día 0 suele ser el de salida.

| Campo                     | Para qué sirve                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `kanji`, `kana`, `romaji` | Nombre del lugar en el cartel de estación                                                 |
| `title`, `base`           | Título del día y dónde se duerme                                                          |
| `geo`                     | Coordenadas, ilustración (`scene`), temperaturas medias y nombre para el mapa y el tiempo |
| `stops`                   | Paradas del día, en orden                                                                 |
| `route`                   | Lugares para el botón "Ruta en Google Maps"                                               |
| `tips`, `warning`         | Consejos y un aviso destacado opcional                                                    |
| `bookings`                | Reservas que conviene guardar ese día: aparecen como sugerencias en la pestaña Reservas   |

Con `geo.abroad: true` el día no se dibuja en los mapas de Japón (útil para el día del vuelo).

Escenas disponibles para `geo.scene`: `plane`, `city`, `sea`, `fuji`, `lantern`, `pagoda`, `torii`, `bamboo`, `castle`, `roof`, `miyajima`, `alps`, `gassho`, `shop`, `lights` y `tower`.

### Paradas

```ts
{
  time: "Mañana",          // "HH:MM" o una franja: Amanecer, Mañana, Mediodía, Tarde, Atardecer, Noche, Todo el día, Llegada
  start: "08:15",          // opcional: hora exacta cuando `time` es una franja
  kind: "visit",           // flight, train, visit, food, shop, stay, logistics o night
  title: "Templo Senso-ji",
  detail: "…",             // opcional
  prices: [{ free: true }, { yen: 100, note: "omikuji" }], // opcional, por persona
  place: "Senso-ji",       // opcional: búsqueda de Google Maps
}
```

Las franjas sin hora se reparten solas para no solaparse; el modo viaje y el calendario `.ics` usan esas horas.

## 5. Alojamientos: `STAYS`

Cada estancia empieza el día que acaba la anterior (`from` + `nights`). En la pestaña **Frases** se puede guardar el nombre y la dirección en japonés de cada hotel para enseñarla al taxista.

## 6. Presupuesto: `BUDGET`

Importes **por persona** en euros. El campo `cat` (`stay`, `transport`, `food`, `tickets`, `shopping` u `other`) enlaza cada línea con las categorías de gastos reales, así el informe de gastos compara lo gastado con lo previsto.

## 7. Logística y tareas: `LOGISTICS` y `TASKS`

`LOGISTICS` son notas fijas de la pestaña Viaje. `TASKS` es la lista de cosas por hacer antes de salir: cada una necesita un `id` único, y con `due` se ordenan y avisan cuando se acerca la fecha.

## 8. Frases: `src/data/phrases.ts`

Frases útiles agrupadas por situación y teléfonos de emergencia. Añade o quita las que quieras.

## 9. Idiomas

La interfaz ya está traducida al español, catalán, inglés y francés: no hay que hacer nada. Cada visitante ve la web en el idioma de su navegador (si es uno de los cuatro) y puede cambiarlo con el selector de la barra superior; la elección se recuerda en ese dispositivo. También se puede enlazar a un idioma con `?idioma=en`.

El **contenido** de `trip.ts` lo escribes en un solo idioma, el de `TRIP.lang`. Para mostrarlo traducido en los otros idiomas hay diccionarios en `src/i18n/content/<idioma>.ts`, donde cada clave es un texto exacto de `trip.ts` y el valor, su traducción:

```ts
const content: Record<string, string> = {
  "Llegada a Tokio": "Arrival in Tokyo",
  Mañana: "Morning",
};
```

- Los textos sin traducción se muestran tal cual, así que puedes traducir solo lo que quieras.
- Los diccionarios incluidos traducen el viaje de ejemplo. Si cambias los textos de `trip.ts`, esas entradas dejan de usarse: bórralas o rehaz los diccionarios con tus textos. Si tu guía es para un solo idioma, puedes vaciarlos.
- Las franjas horarias (`Mañana`, `Morning`, `Matí`, `Matin`…) se reconocen en los cuatro idiomas para calcular la hora de inicio.

Para añadir otro idioma a la interfaz: añádelo a `LANGS`, `LANG_NAMES` y `LOCALES` en `src/i18n/langs.ts`; TypeScript señalará cada archivo de `src/i18n/messages/` y las frases de `phrases.ts` en los que falta su traducción.

## 10. Iconos, título y vista previa

- **Icono de la app y modo sin conexión:** `public/icon.svg` y los PNG de `public/` (192, 512, maskable, `apple-touch-icon`, `favicon`). Cambia el SVG y vuelve a exportar los PNG con el mismo nombre.
- **Nombre al instalarla:** sale de `TRIP.title` (se aplica en `vite.config.ts`).
- **Vista previa al compartir el enlace:** `public/og-image.png` (1200 × 630) y las etiquetas `og:` de `index.html`. Cambia en `index.html` la URL absoluta de `og:image` por la de tu web.
- **Colores:** los temas están en `src/styles.css`. Si cambias los colores de los bloques (`--c-1` a `--c-4`), mantén el contraste AA (ver [TESTING.md](TESTING.md)).

## Comprobar y publicar

```bash
npm run check   # tipos, lint, formato y tests
npm run build   # genera dist/
```

Sube los cambios a `main` y, si tienes GitHub Pages activado con _GitHub Actions_, la web se publica sola. Consulta el [README](../README.md#publicar-en-github-pages).
