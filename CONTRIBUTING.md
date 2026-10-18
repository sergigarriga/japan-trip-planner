# Contribuir

¡Gracias por querer mejorar la guía! Unas pautas para que sea fácil revisar los cambios.

## Preparar el entorno

```bash
npm install
npm run dev
```

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
- La interfaz está en español; los comentarios, también.
- Mensajes de commit con [Conventional Commits](https://www.conventionalcommits.org/es/) (`feat:`, `fix:`, `docs:`…).

## Ideas bienvenidas

- Traducción de la interfaz a otros idiomas.
- Gastos entre más de dos personas.
- Soporte offline completo con un service worker.
