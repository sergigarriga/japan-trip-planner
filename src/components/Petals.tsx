import { useMemo } from "react";

/** Posiciones pseudoaleatorias pero deterministas, para que los pétalos no salten entre renders. */
function makePetals(count: number) {
  let seed = 7;
  const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: count }, () => ({
    left: `${rand() * 100}%`,
    size: `${8 + rand() * 10}px`,
    duration: `${14 + rand() * 14}s`,
    delay: `${-rand() * 28}s`,
    drift: `${(rand() - 0.5) * 160}px`,
  }));
}

/** Pétalos de sakura cayendo al fondo. Solo decorativo; desaparece con reduced-motion. */
export function Petals({ count = 14 }: { count?: number }) {
  const petals = useMemo(() => makePetals(count), [count]);

  return (
    <div className="petals" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          style={
            {
              left: p.left,
              "--size": p.size,
              "--dur": p.duration,
              "--delay": p.delay,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
