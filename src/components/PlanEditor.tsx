import { useState } from "react";
import type { Price, StopKind as Kind } from "../types";
import { newId } from "../db";
import { buzz, shortDate } from "../lib";
import type { DayContent, PlanDay, PlanStop } from "../state";
import { useTrip } from "../state";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

const KINDS: { id: Kind; label: string }[] = [
  { id: "visit", label: "Visita" },
  { id: "food", label: "Comida" },
  { id: "train", label: "Transporte" },
  { id: "shop", label: "Compras" },
  { id: "night", label: "Noche" },
  { id: "stay", label: "Alojamiento" },
  { id: "logistics", label: "Logística" },
  { id: "flight", label: "Vuelo" },
];

function contentOf(d: PlanDay): DayContent {
  return {
    origin: d.origin,
    kanji: d.kanji,
    kana: d.kana,
    romaji: d.romaji,
    title: d.title,
    base: d.base,
    route: d.route,
    tips: d.tips,
    warning: d.warning,
    stops: d.stops.map((s) => ({ ...s, prices: s.prices?.map((p) => ({ ...p })) })),
  };
}

type Props = { day: PlanDay; onClose: () => void };

export function PlanEditor({ day, onClose }: Props) {
  const { days, edited, saveDay, swapDays, resetDay } = useTrip();
  const [draft, setDraft] = useState<DayContent>(() => contentOf(day));
  const [tips, setTips] = useState(day.tips.join("\n"));
  const [swapWith, setSwapWith] = useState<number>(-1);

  const setStop = (id: string, patch: Partial<PlanStop>) =>
    setDraft((d) => ({ ...d, stops: d.stops.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));

  const move = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const stops = [...d.stops];
      const j = i + dir;
      if (j < 0 || j >= stops.length) return d;
      [stops[i], stops[j]] = [stops[j], stops[i]];
      return { ...d, stops };
    });

  const setPrice = (s: PlanStop, j: number, patch: Partial<Price>) =>
    setStop(s.id, { prices: (s.prices ?? []).map((p, k) => (k === j ? { ...p, ...patch } : p)) });

  const save = () => {
    saveDay(day.n, {
      ...draft,
      tips: tips
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      warning: draft.warning?.trim() || undefined,
      stops: draft.stops.filter((s) => s.title.trim()),
    });
    buzz();
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={`Editar día ${day.n}`} className="sheet--wide">
      <div className="form editor">
        <div className="form__row">
          <label>
            <span>Título</span>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </label>
          <label>
            <span>Dormís en</span>
            <input value={draft.base} onChange={(e) => setDraft({ ...draft, base: e.target.value })} />
          </label>
        </div>

        <h3 className="editor__h">Paradas</h3>
        <ol className="editor__stops">
          {draft.stops.map((s, i) => (
            <li key={s.id} className="editor__stop">
              <div className="editor__bar">
                <span className="editor__n">{i + 1}</span>
                <select
                  value={s.kind}
                  onChange={(e) => setStop(s.id, { kind: e.target.value as Kind })}
                  aria-label="Tipo"
                >
                  {KINDS.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.label}
                    </option>
                  ))}
                </select>
                <input
                  className="editor__time"
                  value={s.time}
                  onChange={(e) => setStop(s.id, { time: e.target.value })}
                  placeholder="Mañana"
                  aria-label="Momento del día"
                />
                <input
                  type="time"
                  value={s.start ?? ""}
                  onChange={(e) => setStop(s.id, { start: e.target.value || undefined })}
                  aria-label="Hora de inicio"
                />
                <span className="editor__tools">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Subir"
                  >
                    <Icon name="up" size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(i, 1)}
                    disabled={i === draft.stops.length - 1}
                    aria-label="Bajar"
                  >
                    <Icon name="down" size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--danger"
                    onClick={() => setDraft({ ...draft, stops: draft.stops.filter((x) => x.id !== s.id) })}
                    aria-label="Borrar parada"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </span>
              </div>
              <input
                className="editor__title"
                value={s.title}
                onChange={(e) => setStop(s.id, { title: e.target.value })}
                placeholder="Qué hacéis"
              />
              <textarea
                rows={2}
                value={s.detail ?? ""}
                onChange={(e) => setStop(s.id, { detail: e.target.value || undefined })}
                placeholder="Detalle (opcional)"
              />
              <input
                value={s.place ?? ""}
                onChange={(e) => setStop(s.id, { place: e.target.value || undefined })}
                placeholder="Lugar para Google Maps (opcional)"
              />
              <div className="editor__prices">
                {(s.prices ?? []).map((p, j) => (
                  <div key={j} className="editor__price">
                    <input
                      inputMode="numeric"
                      value={p.free ? "" : (p.yen ?? "")}
                      disabled={p.free}
                      onChange={(e) => setPrice(s, j, { yen: Number(e.target.value.replace(/\D/g, "")) || undefined })}
                      placeholder="¥"
                      aria-label="Precio en yenes"
                    />
                    <input
                      value={p.note ?? ""}
                      onChange={(e) => setPrice(s, j, { note: e.target.value || undefined })}
                      placeholder="nota"
                      aria-label="Nota del precio"
                    />
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={!!p.free}
                        onChange={(e) => setPrice(s, j, { free: e.target.checked || undefined })}
                      />
                      Gratis
                    </label>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => setStop(s.id, { prices: (s.prices ?? []).filter((_, k) => k !== j) })}
                      aria-label="Quitar precio"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => setStop(s.id, { prices: [...(s.prices ?? []), {}] })}
                >
                  <Icon name="plus" size={14} />
                  Añadir precio
                </button>
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="btn btn--ghost btn--block"
          onClick={() =>
            setDraft({ ...draft, stops: [...draft.stops, { id: newId(), time: "Tarde", kind: "visit", title: "" }] })
          }
        >
          <Icon name="plus" />
          Añadir parada
        </button>

        <label>
          <span>A tener en cuenta (uno por línea)</span>
          <textarea rows={4} value={tips} onChange={(e) => setTips(e.target.value)} />
        </label>
        <label>
          <span>Aviso destacado</span>
          <textarea
            rows={2}
            value={draft.warning ?? ""}
            onChange={(e) => setDraft({ ...draft, warning: e.target.value })}
          />
        </label>

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn--primary" onClick={save}>
            Guardar cambios
          </button>
        </div>

        <section className="editor__swap">
          <h3 className="editor__h">Mover el plan a otra fecha</h3>
          <p className="muted">
            Intercambia el contenido de este día con otro. Las fechas se quedan, los planes se cruzan.
          </p>
          <div className="form__row">
            <select
              value={swapWith}
              onChange={(e) => setSwapWith(Number(e.target.value))}
              aria-label="Día con el que intercambiar"
            >
              <option value={-1}>Elige un día</option>
              {days
                .filter((d) => d.n !== day.n)
                .map((d) => (
                  <option key={d.n} value={d.n}>
                    Día {d.n}, {shortDate(d.date)}: {d.title}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="btn btn--ghost"
              disabled={swapWith < 0}
              onClick={() => {
                swapDays(day.n, swapWith);
                buzz();
                onClose();
              }}
            >
              <Icon name="swap" />
              Intercambiar
            </button>
          </div>
          {edited[day.n] && (
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                resetDay(day.n);
                onClose();
              }}
            >
              <Icon name="undo" size={14} />
              Restaurar el plan original de esta fecha
            </button>
          )}
        </section>
      </div>
    </Sheet>
  );
}
