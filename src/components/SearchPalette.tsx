import { useMemo, useState } from "react";
import type { Phrase } from "../data/phrases";
import { PHRASE_GROUPS } from "../data/phrases";
import { msg, tc, useLang } from "../i18n";
import { m } from "../i18n/messages/searchPalette";
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
  const lang = useLang();
  const t = msg(m);

  // `lang` cambia lo que devuelven `tc()` y `m[lang]`: se busca en el texto traducido y en el original.
  const results = useMemo(() => {
    const query = norm(q.trim());
    if (!query) return { days: days.slice(1, 19), stops: [], phrases: [] };
    const has = (...xs: (string | undefined)[]) => xs.some((x) => x && norm(x).includes(query));
    const both = (x: string | undefined) => [x, tc(x)];
    return {
      days: days
        .filter((d) => has(...both(d.title), d.kanji, d.romaji, ...both(d.base), m[lang].day(d.n), shortDate(d.date)))
        .slice(0, 6),
      stops: days
        .flatMap((d) => d.stops.map((s) => ({ d, s })))
        .filter(({ s }) => has(...both(s.title), ...both(s.detail), s.place))
        .slice(0, 8),
      phrases: PHRASE_GROUPS.flatMap((g) => g.phrases)
        .filter((p) => has(p.meaning[lang], p.romaji, p.jp))
        .slice(0, 4),
    };
  }, [q, days, lang]);

  const go = (n: number) => {
    onGoDay(n);
    onClose();
    setQ("");
  };

  const nothing = q && !results.days.length && !results.stops.length && !results.phrases.length;

  return (
    <Sheet open={open} onClose={onClose} title={t.title}>
      <div className="search">
        <label className="search__box">
          <Icon name="search" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.placeholder}
            aria-label={t.aria}
          />
        </label>

        {nothing && <p className="empty">{t.nothing(q)}</p>}

        {results.days.length > 0 && (
          <div className="search__group">
            <p className="search__label">{q ? t.days : t.allDays}</p>
            <ul>
              {results.days.map((d) => (
                <li key={d.n}>
                  <button className="search__item" data-block={d.block} onClick={() => go(d.n)}>
                    <span className="search__kanji">{d.kanji}</span>
                    <span>
                      <strong>{tc(d.title)}</strong>
                      <small>
                        {t.day(d.n)}, {shortDate(d.date)}
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
            <p className="search__label">{t.stops}</p>
            <ul>
              {results.stops.map(({ d, s }) => (
                <li key={s.id}>
                  <button className="search__item" data-block={d.block} onClick={() => go(d.n)}>
                    <span className="search__dot" />
                    <span>
                      <strong>{tc(s.title)}</strong>
                      <small>
                        {t.day(d.n)}, {shortDate(d.date)}, {tc(s.time)}
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
            <p className="search__label">{t.phrases}</p>
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
                      <strong>{p.meaning[lang]}</strong>
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
