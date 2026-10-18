import { useState } from "react";
import { TRIP } from "../data/trip";
import { useNow, useWakeLock } from "../hooks";
import { locale, msg, tc } from "../i18n";
import { m } from "../i18n/messages/travelPanel";
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

const clock = (tz: string) => new Intl.DateTimeFormat(locale(), { timeZone: tz, hour: "2-digit", minute: "2-digit" });

const QUICK_YEN = [1000, 5000, 10000];
const RING_R = 20;
const RING_C = 2 * Math.PI * RING_R;

function inMinutes(diff: number): string {
  const t = msg(m);
  if (diff < 60) return t.inMin(diff);
  return t.inHours(Math.floor(diff / 60), diff % 60);
}

export function TravelPanel({ day, todayN, onGo, wake, onWake }: Props) {
  const { days, done, toggleDone } = useTrip();
  const t = msg(m);
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
  const JST = clock("Asia/Tokyo");
  const HOME = clock(TRIP.home.timeZone);
  const eurFmt = new Intl.NumberFormat(locale(), { style: "currency", currency: "EUR" });

  let label = t.nextStop;
  if (next && isToday) {
    const at = starts[nextIdx].min;
    label = at <= jst.min ? t.nowDue : t.atTime(fmtMin(at), inMinutes(at - jst.min));
  }

  return (
    <section className="travel" aria-label={t.panel}>
      <header className="travel__head">
        <div className="clock clock--main">
          <span className="clock__city">東京</span>
          <strong>{JST.format(now)}</strong>
        </div>
        <div className="clock">
          <span className="clock__city">{TRIP.home.code}</span>
          <strong>{HOME.format(now)}</strong>
        </div>
        <div className="ring" role="img" aria-label={t.ring(doneCount, total)}>
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
          {t.otherDay}
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
              <span className="tnow__count">{t.position(nextIdx + 1, total)}</span>
            </p>
            <h3 className="tnow__title">{tc(next.title)}</h3>
          </div>
          <div className="tnow__bottom">
            <dl className="tnow__facts">
              <div>
                <dt>{t.when}</dt>
                <dd>
                  {starts[nextIdx].exact
                    ? fmtMin(starts[nextIdx].min)
                    : `${tc(next.time)}, ~${fmtMin(starts[nextIdx].min)}`}
                </dd>
              </div>
              {next.prices && (
                <div>
                  <dt>{t.price}</dt>
                  <dd>{next.prices.map((p) => priceLabel(p, tc).main).join(" + ")}</dd>
                </div>
              )}
            </dl>
            {next.detail && <p className="tnow__detail">{tc(next.detail)}</p>}
            <div className="tnow__actions">
              {next.place && (
                <a className="btn btn--primary" href={mapsDirections(next.place)} target="_blank" rel="noreferrer">
                  <Icon name="map" />
                  {t.directions}
                </a>
              )}
              <button className="btn btn--ghost" onClick={() => toggleDone(next.id)}>
                <Icon name="check" />
                {t.done}
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
              {t.dayDone}
            </p>
            <h3 className="tnow__title">{t.allSeen}</h3>
          </div>
          {tomorrow && (
            <div className="tnow__bottom">
              <button className="btn btn--primary" onClick={() => onGo(tomorrow.n)}>
                {t.seeTomorrow(tc(tomorrow.title))}
              </button>
            </div>
          )}
        </article>
      )}

      {after.length > 0 && (
        <div className="after">
          <p className="after__label">{t.after}</p>
          <ol>
            {after.map(({ s, i }) => (
              <li key={s.id}>
                <span className="after__time">{starts[i].exact ? fmtMin(starts[i].min) : tc(s.time)}</span>
                <span className="after__title">{tc(s.title)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="travel__tools">
        <div className="tool conv">
          <label className="conv__row">
            <span className="tool__label">{t.yen}</span>
            <input
              inputMode="numeric"
              value={yenInput}
              onChange={(e) => setYenInput(e.target.value)}
              aria-label={t.yenAmount}
            />
            <span className="conv__eq">=</span>
            <strong>{eurFmt.format(yenValue / TRIP.yenPerEur)}</strong>
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
              <strong>{t.wake}</strong>
              <small>{wake ? t.wakeOn : t.wakeOff}</small>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
