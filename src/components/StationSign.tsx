import { useRef } from "react";
import { DAYS } from "../data/trip";
import type { Block } from "../types";
import { msg } from "../i18n";
import { m } from "../i18n/messages/stationSign";
import { longDate } from "../lib";
import type { PlanDay } from "../state";
import { DestinationArt } from "./DestinationArt";
import { useFileUrl } from "../hooks";

type Props = {
  day: PlanDay;
  block: Block;
  prev?: PlanDay;
  next?: PlanDay;
  compact?: boolean;
  coverId?: string;
  onGo: (n: number) => void;
};

/** Cartel de andén estilo JR (駅名標): el día actual en el centro, el anterior y el siguiente a los lados. */
export function StationSign({ day, block, prev, next, compact, coverId, onGo }: Props) {
  const ref = useRef<HTMLElement>(null);
  const cover = useFileUrl(coverId);
  const t = msg(m);

  // Inclinación 3D suave siguiendo el puntero (solo ratón/trackpad).
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    ref.current.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    ref.current.style.setProperty("--mx", `${x * 100}%`);
    ref.current.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <section
      ref={ref}
      className={`sign${compact ? " sign--compact" : ""}${cover ? " sign--cover" : ""}`}
      data-block={block.id}
      aria-live="polite"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {cover ? (
        <img className="sign__cover" src={cover} alt="" key={cover} />
      ) : (
        <DestinationArt key={day.origin} scene={DAYS[day.origin].geo.scene} className="sign__art" />
      )}

      <div className="sign__top">
        <div className="sign__number" aria-label={t.day(day.n)}>
          <span>{block.code}</span>
          <strong>{String(day.n).padStart(2, "0")}</strong>
        </div>
        <p className="sign__date">{longDate(day.date)}</p>
      </div>

      <div className="sign__name" key={`${day.n}-${day.origin}`}>
        <p className="sign__kana">{day.kana}</p>
        <h1 className="sign__kanji" aria-label={day.kanji}>
          {[...day.kanji].map((c, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties} aria-hidden="true">
              {c}
            </span>
          ))}
        </h1>
        <p className="sign__romaji">{day.romaji}</p>
      </div>

      <div className="sign__bar">
        <button
          className="sign__nav sign__nav--prev"
          onClick={() => prev && onGo(prev.n)}
          disabled={!prev}
          aria-label={prev ? t.prev(prev.romaji) : t.noPrev}
        >
          {prev && (
            <>
              <span className="sign__arrow">◀</span>
              <span>{prev.romaji}</span>
            </>
          )}
        </button>
        <button
          className="sign__nav sign__nav--next"
          onClick={() => next && onGo(next.n)}
          disabled={!next}
          aria-label={next ? t.next(next.romaji) : t.noNext}
        >
          {next && (
            <>
              <span>{next.romaji}</span>
              <span className="sign__arrow">▶</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
