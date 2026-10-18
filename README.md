# 日本 Japan Trip Planner

Guía de viaje a Japón día a día, pensada para el móvil y cómoda también en el ordenador. Itinerario, mapas, reservas, gastos y frases útiles en una sola web que funciona sin servidor y se adapta a tu viaje editando **un único archivo**.

[![CI](https://github.com/sergigarriga/japan-trip-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/sergigarriga/japan-trip-planner/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue.svg)](LICENSE)

**Demo:** https://sergigarriga.github.io/japan-trip-planner/ (con un viaje de ejemplo de 19 días en otoño)

## Qué incluye

- **Cuatro idiomas**: español, català, English y français. Se elige con el selector de la barra superior (o con `?idioma=ca|es|en|fr`) y, la primera vez, sigue el idioma del navegador.
- **Responsive**: una columna en el móvil y, en pantallas grandes, cartel y línea de días fijos a la izquierda con el detalle a la derecha.
- **Día a día** con cartel de estación estilo JR, paradas con horario, precios en yenes y euros, ruta en Google Maps y consejos.
- **Modo viaje**: siguiente parada con cuenta atrás, doble reloj (Japón y casa), conversor de yenes y pantalla siempre encendida.
- **Calendario del viaje** con los bloques de color, mapa real de la ruta (OpenStreetMap) y alojamientos.
- **Editor del plan**: cambia paradas, reordena o intercambia días desde el móvil.
- **Reservas y diario**: guarda QR, PDFs, fotos y notas de cada día.
- **Gastos compartidos** entre dos personas, con presupuesto por categoría y quién debe a quién.
- **Tareas** con fecha límite para ir reservando antes de salir.
- **Frases en japonés** con voz y tarjeta para enseñar, y direcciones para el taxi.
- **Tiempo**: previsión de Open-Meteo cuando faltan 15 días o menos y media histórica antes.
- Exportación a **.ics** para cualquier calendario, búsqueda rápida (`/` o `Ctrl+K`), tres temas y diseño accesible.

## Privacidad

No hay servidor ni cuentas: todo lo que añades desde la web (reservas, fotos, gastos, notas, cambios del plan) se guarda **solo en el navegador** de cada dispositivo (`localStorage` e IndexedDB).

El contenido de `src/data/trip.ts`, en cambio, forma parte de la web publicada y cualquiera con el enlace puede verlo. No pongas ahí códigos de reserva, enlaces privados ni datos personales: guárdalos desde la pestaña **Reservas** de cada día.

## Empezar

Necesitas [Node.js](https://nodejs.org/) 20 o superior.

```bash
git clone https://github.com/sergigarriga/japan-trip-planner.git
cd japan-trip-planner
npm install
npm run dev
```

Abre la dirección que aparece en la terminal. Con `--host` también puedes abrirla desde el móvil en la misma red wifi.

## Personalizar tu viaje

Todo el viaje vive en [`src/data/trip.ts`](src/data/trip.ts): datos generales, vuelos, días, alojamientos, presupuesto y tareas. Los tipos de [`src/types.ts`](src/types.ts) te avisan en el editor si falta algo, y `npm test` comprueba que los datos son coherentes (fechas seguidas, bloques que existen, estancias sin huecos…).

La guía completa está en [docs/CUSTOMIZING.md](docs/CUSTOMIZING.md).

## Publicar en GitHub Pages

1. Haz un **fork** de este repositorio (o usa _Use this template_).
2. Edita `src/data/trip.ts` con tu viaje y sube los cambios a `main`.
3. En tu repositorio, ve a **Settings → Pages** y en _Source_ elige **GitHub Actions**.
4. El flujo [`deploy.yml`](.github/workflows/deploy.yml) compila y publica la web en cada push a `main`, en `https://<tu-usuario>.github.io/<tu-repo>/`.

La web usa rutas relativas, así que funciona igual en GitHub Pages, en un dominio propio o en cualquier hosting estático (copiando la carpeta `dist/`).

## Scripts

| Comando           | Qué hace                                                 |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga en caliente           |
| `npm run build`   | Comprueba tipos y genera la web en `dist/`               |
| `npm run preview` | Sirve la versión compilada para probarla                 |
| `npm test`        | Tests de la lógica y validación de los datos del viaje   |
| `npm run lint`    | ESLint (TypeScript y reglas de React)                    |
| `npm run format`  | Formatea el código con Prettier                          |
| `npm run check`   | Tipos, lint, formato y tests: lo mismo que ejecuta la CI |

## Estructura

```
src/
├── data/
│   ├── trip.ts        ← tu viaje: el único archivo que hace falta editar
│   └── phrases.ts     frases en japonés (con su significado en los 4 idiomas) y emergencias
├── i18n/
│   ├── messages/      textos de la interfaz, un archivo por componente con los 4 idiomas
│   └── content/       traducciones del contenido de trip.ts (opcional)
├── types.ts           modelo de datos del viaje
├── components/        vistas y componentes de React
├── state/             estado del viaje (plan editado, gastos, reservas…) guardado en el navegador
├── lib/               lógica pura: fechas, dinero, horarios, calendario .ics, mapas
├── hooks.ts           hooks compartidos (almacenamiento, reloj, wake lock, archivos)
├── db.ts              archivos en IndexedDB (fotos, QR, PDFs)
└── styles.css         estilos y temas (Sakura, Andén, Neón)
```

## Tecnología

[React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) estricto + [Vite](https://vite.dev/), con [Leaflet](https://leafletjs.com/) para el mapa. Sin backend ni claves de API: los mapas son de OpenStreetMap y el tiempo, de [Open-Meteo](https://open-meteo.com/).

## Contribuir

Las mejoras son bienvenidas. Lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir un pull request.

## Licencia

[MIT](LICENSE)
