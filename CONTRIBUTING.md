# Contribuir

¡Gracias por querer mejorar la guía! Unas pautas para que sea fácil revisar los cambios.

## Preparar el entorno

```bash
npm install
npm run dev
```

## Flujo de trabajo

`main` está protegida: no se hace push directo. Crea una rama (`feat/lo-que-sea`), sube los cambios y abre un pull request. Se fusiona cuando la CI (`check`) está en verde.

## Antes de abrir un pull request

```bash
npm run check   # tipos, ESLint, Prettier y tests
npm run build
```

La CI ejecuta lo mismo en cada pull request.

## Convenciones

- **TypeScript estricto**: sin `any` y con los tipos del modelo en `src/types.ts`.
- **Lógica pura en `src/lib/`**, con tests en `src/lib/__tests__/`. Los componentes solo pintan y gestionan interacción.
- **Estado del viaje en `src/state/`**: todo lo que el usuario cambia se guarda en el navegador con `useStored`, que añade el prefijo `TRIP.id` a las claves.
- **Sin datos personales en el código**: el viaje de `src/data/trip.ts` es un ejemplo genérico.
- **Accesibilidad**: botones con texto o `aria-label`, contraste suficiente en los tres temas y respeto a `prefers-reduced-motion`.
- **Textos de la interfaz** siempre en `src/i18n/messages/<componente>.ts` con `defineMessages` (es, ca, en y fr con las mismas claves) y leídos con `msg(m)`; el contenido del viaje se muestra con `tc()`. Ningún texto visible escrito directamente en los componentes.
- **Responsive**: comprueba los cambios en móvil (375 px), tablet (~820 px) y escritorio (≥1080 px).
- Los comentarios del código están en español.
- Mensajes de commit con [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `docs:`…).

## Ideas bienvenidas

- Más idiomas para la interfaz (ver la sección Idiomas de docs/CUSTOMIZING.md).
- Gastos entre más de dos personas.
- Soporte offline completo con un service worker.
