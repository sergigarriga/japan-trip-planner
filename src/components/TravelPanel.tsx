import { useState } from "react";
import { TRIP } from "../data/trip";
import { useNow, useWakeLock } from "../hooks";
import { fmtMin, jstNow, mapsDirections, priceLabel, stopStarts, yen } from "../lib";
import type { PlanDay } from "../state";
import { useTrip } from "../state";
import { Icon } from "./Icon";

type Props = {
  day: PlanDay;
  todayN?: number;
  onGo: (n: number) => void;
  wake: boolean;
  onWake: (on: boolean) => void;
};

const clock = (tz: string) => new Intl.DateTimeFormat("es-ES", { timeZone: tz, hour: "2-digit", minute: "2-digit" });
const JST = clock("Asia/Tokyo");
const HOME = clock(TRIP.home.timeZone);

const eurFmt = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
const QUICK_YEN = [1000, 5000, 10000];
const RING_R = 20;
const RING_C = 2 * Math.PI * RING_R;

function inMinutes(diff: number): string {
  if (diff < 60) return `en ${diff} min`;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return m ? `en ${h} h ${m} min` : `en ${h} h`;
}

export function TravelPanel({ day, todayN, onGo, wake, onWake }: Props) {
  const { days, done, toggleDone } = useTrip();
  const now = useNow();
  const wakeSupported = useWakeLock(wake);
  const [yenInput, setYenInput] = useState("1000");

  const starts = stopStarts(day.stops);
  const jst = jstNow(now);
  const isToday = jst.date === day.date;

  const total = day.stops.length;
  const doneCount = day.stops.filter((s) => done[s.id]).length;
  const nextIdx = day.stops.findIndex((s) => !done[s.id]);
  const next = nextIdx >= 0 ? day.stops[nextIdx] : undefined;
  const after = day.stops
    .map((s, i) => ({ s, i }))
    .filter(({ s, i }) => i > nextIdx && !done[s.id])
    .slice(0, 2);
  const tomorrow = days.find((d) => d.n === day.n + 1);
  const yenValue = Number(yenInput.replace(/\D/g, "")) || 0;
  const progress = total ? doneCount / total : 0;

  let label = "Siguiente parada";
  if (next && isToday) {
    const at = starts[nextIdx].min;
    label = at <= jst.min ? "Ahora toca" : `A las ${fmtMin(at)}, ${inMinutes(at - jst.min)}`;
  }

  return (
    <section className="travel" aria-label="Modo viaje">
      <header className="travel__head">
        <div className="clock clock--main">
          <span className="clock__city">東京</span>
          <strong>{JST.format(now)}</strong>
        </div>
        <div className="clock">
          <span className="clock__city">{TRIP.home.code}</span>
          <strong>{HOME.format(now)}</strong>
        </div>
        <div className="ring" role="img" aria-label={`${doneCount} de ${total} paradas hechas`}>
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle className="ring__track" cx="24" cy="24" r={RING_R} />
            <circle
              className="ring__fill"
              cx="24"
              cy="24"
              r={RING_R}
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress)}
            />
          </svg>
          <span>
            {doneCount}/{total}
          </span>
        </div>
      </header>

      {todayN != null && todayN !== day.n && (
        <button className="travel__today" onClick={() => onGo(todayN)}>
          Estás viendo otro día. Ir a hoy
        </button>
      )}

      {next ? (
        <article className="tnow" key={`${day.n}-${next.id}`}>
          <div className="tnow__top">
            <span className="tnow__kanji" aria-hidden="true">
              {day.kanji}
            </span>
            <p className="tnow__label">
              <span className="tnow__jp">次</span>
              {label}
              <span className="tnow__count">
                {nextIdx + 1} de {total}
              </span>
            </p>
            <h3 className="tnow__title">{next.title}</h3>
          </div>
          <div className="tnow__bottom">
            <dl className="tnow__facts">
              <div>
                <dt>Cuándo</dt>
                <dd>
                  {starts[nextIdx].exact
                    ? fmtMin(starts[nextIdx].min)
                    : `${next.time}, ~${fmtMin(starts[nextIdx].min)}`}
                </dd>
              </div>
              {next.prices && (
                <div>
                  <dt>Precio</dt>
                  <dd>{next.prices.map((p) => priceLabel(p).main).join(" + ")}</dd>
                </div>
              )}
            </dl>
            {next.detail && <p className="tnow__detail">{next.detail}</p>}
            <div className="tnow__actions">
              {next.place && (
                <a className="btn btn--primary" href={mapsDirections(next.place)} target="_blank" rel="noreferrer">
                  <Icon name="map" />
                  Cómo llegar
                </a>
              )}
              <button className="btn btn--ghost" onClick={() => toggleDone(next.id)}>
                <Icon name="check" />
                Hecho
              </button>
            </div>
          </div>
        </article>
      ) : (
        <article className="tnow tnow--done">
          <div className="tnow__top">
            <span className="tnow__kanji" aria-hidden="true">
              完
            </span>
            <p className="tnow__label">
              <span className="tnow__jp">完</span>
              Día completado
            </p>
            <h3 className="tnow__title">Todo visto. A descansar.</h3>
          </div>
          {tomorrow && (
            <div className="tnow__bottom">
              <button className="btn btn--primary" onClick={() => onGo(tomorrow.n)}>
                Ver mañana: {tomorrow.title}
              </button>
            </div>
          )}
        </article>
      )}

      {after.length > 0 && (
        <div className="after">
          <p className="after__label">Después</p>
          <ol>
            {after.map(({ s, i }) => (
              <li key={s.id}>
                <span className="after__time">{starts[i].exact ? fmtMin(starts[i].min) : s.time}</span>
                <span className="after__title">{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="travel__tools">
        <div className="tool conv">
          <label className="conv__row">
            <span className="tool__label">Yenes</span>
            <input
              inputMode="numeric"
              value={yenInput}
              onChange={(e) => setYenInput(e.target.value)}
              aria-label="Cantidad en yenes"
            />
            <span className="conv__eq">=</span>
            <strong>{eurFmt.format(yenValue / TRIP.yenPerEur)} €</strong>
          </label>
          <div className="conv__quick">
            {QUICK_YEN.map((v) => (
              <button key={v} className={yenValue === v ? "is-active" : ""} onClick={() => setYenInput(String(v))}>
                {yen(v)}
              </button>
            ))}
          </div>
        </div>
        {wakeSupported && (
          <button
            className={`tool wake${wake ? " is-on" : ""}`}
            role="switch"
            aria-checked={wake}
            onClick={() => onWake(!wake)}
          >
            <span className="wake__icon">
              <Icon name="sun" size={20} />
            </span>
            <span className="wake__text">
              <strong>Pantalla fija</strong>
              <small>{wake ? "No se apagará" : "Se apaga sola"}</small>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
