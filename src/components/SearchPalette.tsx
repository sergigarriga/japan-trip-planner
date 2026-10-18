import { useMemo, useState } from "react";
import type { Phrase } from "../data/phrases";
import { PHRASE_GROUPS } from "../data/phrases";
import { shortDate } from "../lib";
import { useTrip } from "../state";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

type Props = {
  open: boolean;
  onClose: () => void;
  onGoDay: (n: number) => void;
  onPhrase: (p: Phrase) => void;
};

export function SearchPalette({ open, onClose, onGoDay, onPhrase }: Props) {
  const { days } = useTrip();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const t = norm(q.trim());
    if (!t) return { days: days.slice(1, 19), stops: [], phrases: [] };
    const has = (...xs: (string | undefined)[]) => xs.some((x) => x && norm(x).includes(t));
    return {
      days: days.filter((d) => has(d.title, d.kanji, d.romaji, d.base, `dia ${d.n}`, shortDate(d.date))).slice(0, 6),
      stops: days
        .flatMap((d) => d.stops.map((s) => ({ d, s })))
        .filter(({ s }) => has(s.title, s.detail, s.place))
        .slice(0, 8),
      phrases: PHRASE_GROUPS.flatMap((g) => g.phrases)
        .filter((p) => has(p.es, p.romaji, p.jp))
        .slice(0, 4),
    };
  }, [q, days]);

  const go = (n: number) => {
    onGoDay(n);
    onClose();
    setQ("");
  };

  const nothing = q && !results.days.length && !results.stops.length && !results.phrases.length;

  return (
    <Sheet open={open} onClose={onClose} title="Buscar">
      <div className="search">
        <label className="search__box">
          <Icon name="search" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nara, ramen, teamLab, 21 nov…"
            aria-label="Buscar en el viaje"
          />
        </label>

        {nothing && <p className="empty">Nada con «{q}». Prueba con un sitio, una comida o una fecha.</p>}

        {results.days.length > 0 && (
          <div className="search__group">
            <p className="search__label">{q ? "Días" : "Todos los días"}</p>
            <ul>
              {results.days.map((d) => (
                <li key={d.n}>
                  <button className="search__item" data-block={d.block} onClick={() => go(d.n)}>
                    <span className="search__kanji">{d.kanji}</span>
                    <span>
                      <strong>{d.title}</strong>
                      <small>
                        Día {d.n}, {shortDate(d.date)}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.stops.length > 0 && (
          <div className="search__group">
            <p className="search__label">Paradas</p>
            <ul>
              {results.stops.map(({ d, s }) => (
                <li key={s.id}>
                  <button className="search__item" data-block={d.block} onClick={() => go(d.n)}>
                    <span className="search__dot" />
                    <span>
                      <strong>{s.title}</strong>
                      <small>
                        Día {d.n}, {shortDate(d.date)}, {s.time}
                      </small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.phrases.length > 0 && (
          <div className="search__group">
            <p className="search__label">Frases</p>
            <ul>
              {results.phrases.map((p) => (
                <li key={p.jp}>
                  <button
                    className="search__item"
                    onClick={() => {
                      onPhrase(p);
                      onClose();
                    }}
                  >
                    <span className="search__kanji">話</span>
                    <span>
                      <strong>{p.es}</strong>
                      <small>{p.jp}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Sheet>
  );
}
