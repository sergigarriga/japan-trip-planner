import { useEffect, useRef } from "react";
import { shortDate } from "../lib";
import { useTrip } from "../state";

type Props = { selected: number; today?: number; onSelect: (n: number) => void };

/** Selector de días dibujado como una línea de metro: cada día es una parada. */
export function DayLine({ selected, today, onSelect }: Props) {
  const { days } = useTrip();
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current?.querySelector<HTMLElement>(`[data-n="${selected}"]`);
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected]);

  return (
    <nav className="line" aria-label="Días del viaje">
      <ol ref={ref} className="line__track">
        {days.map((d) => {
          const isSel = d.n === selected;
          return (
            <li key={d.n} data-n={d.n} data-block={d.block}>
              <button
                className={`stop${isSel ? " stop--sel" : ""}${d.n === today ? " stop--today" : ""}`}
                onClick={() => onSelect(d.n)}
                aria-current={isSel ? "date" : undefined}
              >
                <span className="stop__date">{shortDate(d.date)}</span>
                <span className="stop__dot" />
                <span className="stop__kanji">{d.kanji}</span>
                <span className="stop__n">{d.n === today ? "Hoy" : `Día ${d.n}`}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
