# Pruebas

```bash
npm test         # una vez
npx vitest       # en modo vigilancia
npm run check    # tipos + ESLint + Prettier + tests (lo mismo que la CI)
```

## Qué cubren los tests automáticos

| Dónde                        | Qué comprueba                                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/__tests__/`         | Fechas, dinero, horarios, calendario `.ics` y formato por idioma                                                                             |
| `src/data/__tests__/`        | Que los datos de `trip.ts` son coherentes: días seguidos, bloques y estancias válidos, coordenadas, tareas únicas                            |
| `src/i18n/__tests__/`        | Que las traducciones del viaje de ejemplo cubren todos los textos de `trip.ts` y no sobra ninguna                                            |
| `src/state/__tests__/`       | Que editar un día en otro idioma solo guarda lo que el usuario cambia                                                                        |
| `src/__tests__/app.test.tsx` | Que las cinco pestañas se pintan sin errores en los cuatro idiomas, sin fallos de accesibilidad (axe-core) y que el `ErrorBoundary` funciona |

Los textos de la interfaz no necesitan test: TypeScript exige que cada archivo de `src/i18n/messages/` tenga las mismas claves en los cuatro idiomas.

## Lo que se comprueba a mano

jsdom no dibuja ni calcula estilos, así que hay cosas que se verifican en un navegador real:

- **Mapa (Leaflet):** necesita un `<canvas>`; en los tests se sustituye por un marcador de posición.
- **Contraste de color y desbordamientos:** abre la web con `npm run dev` y revisa los tres temas (selector de la barra superior) a 320, 375, 820 y 1440 px. Una forma rápida es ejecutar [axe](https://github.com/dequelabs/axe-core) con la regla `color-contrast` desde el navegador.
- **Modo sin conexión:** `npm run build && npm run preview`, abre la web, desactiva la red en las herramientas del navegador y recarga.

Los colores de los temas Sakura y Andén están calculados para cumplir contraste AA (4,5:1) con texto blanco sobre cada color de bloque y con el texto de color sobre su fondo tintado. Si cambias `--c-1` a `--c-4` en `src/styles.css`, vuelve a comprobarlo.
