import { useState } from "react";
import type { Block, StopKind as Kind } from "../types";
import { TRIP } from "../data/trip";
import { useNow } from "../hooks";
import { msg, tc } from "../i18n";
import { m } from "../i18n/messages/dayView";
import {
  buildIcs,
  dayTotal,
  downloadFile,
  eur,
  fmtMin,
  jstNow,
  mapsRoute,
  mapsSearch,
  priceLabel,
  slug,
  stopStarts,
  yen,
  yenToEur,
} from "../lib";
import type { PlanDay } from "../state";
import { useTrip } from "../state";
import { DayExpenses } from "./Expenses";
import { Icon } from "./Icon";
import { Journal } from "./Journal";
import { Reservations } from "./Reservations";
import { TravelPanel } from "./TravelPanel";
import { WeatherBadge } from "./Weather";

const KIND_LABEL: Record<Kind, () => string> = {
  flight: () => msg(m).kindFlight,
  train: () => msg(m).kindTrain,
  visit: () => msg(m).kindVisit,
  food: () => msg(m).kindFood,
  shop: () => msg(m).kindShop,
  stay: () => msg(m).kindStay,
  logistics: () => msg(m).kindLogistics,
  night: () => msg(m).kindNight,
};

type Sub = "plan" | "bookings" | "money" | "journal";

type Props = {
  day: PlanDay;
  block: Block;
  travel: boolean;
  todayN?: number;
  onGo: (n: number) => void;
  wake: boolean;
  onWake: (on: boolean) => void;
  onEdit: () => void;
};

export function DayView({ day, block, travel, todayN, onGo, wake, onWake, onEdit }: Props) {
  const { done, toggleDone, reservations, expenses, photos, notes, edited } = useTrip();
  const [sub, setSub] = useState<Sub>("plan");
  const t = msg(m);
  const now = useNow(60_000);

  const total = dayTotal(day);
  const starts = stopStarts(day.stops);
  const jst = jstNow(now);
  const isToday = jst.date === day.date;
  const currentIdx = isToday ? starts.map((s) => s.min).filter((m) => m <= jst.min).length - 1 : -1;

  const subs: [Sub, string, number][] = [
    ["plan", t.subPlan, day.stops.length],
    ["bookings", t.subBookings, reservations.filter((r) => r.origin === day.origin).length],
    ["money", t.subMoney, expenses.filter((e) => e.date === day.date).length],
    ["journal", t.subJournal, (photos[day.date]?.length ?? 0) + (notes[day.date]?.trim() ? 1 : 0)],
  ];

  return (
    <div className="day" data-block={block.id}>
      <header className="day__head">
        <p className="day__block">
          {tc(block.name)}
          {edited[day.n] && <span className="tag">{t.edited}</span>}
        </p>
        <h2 className="day__title">{tc(day.title)}</h2>
        <div className="day__facts">
          <WeatherBadge date={day.date} origin={day.origin} />
          <dl>
            <div>
              <dt>{t.sleepIn}</dt>
              <dd>{tc(day.base)}</dd>
            </div>
            {total > 0 && (
              <div>
                <dt>{t.expected}</dt>
                <dd>
                  ~{yen(total)} <span className="muted">({eur(yenToEur(total))})</span>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="day__actions">
          <a className="btn btn--primary" href={mapsRoute(day.route)} target="_blank" rel="noreferrer">
            <Icon name="map" />
            {t.route}
          </a>
          <button
            className="btn btn--ghost btn--icon"
            onClick={() => downloadFile(`${slug(tc(TRIP.title))}-${t.icsName(day.n)}.ics`, buildIcs([day], tc))}
            title={t.calendarHint}
          >
            <Icon name="calendar" />
            <span>{t.calendar}</span>
          </button>
          <button className="btn btn--ghost btn--icon" onClick={onEdit} title={t.editHint}>
            <Icon name="edit" />
            <span>{t.edit}</span>
          </button>
        </div>
      </header>

      {day.warning && (
        <aside className="warning" role="note">
          <Icon name="alert" />
          <p>{tc(day.warning)}</p>
        </aside>
      )}

      {travel && <TravelPanel day={day} todayN={todayN} onGo={onGo} wake={wake} onWake={onWake} />}

      <div
        className="subtabs"
        role="tablist"
        style={{ "--idx": subs.findIndex(([id]) => id === sub) } as React.CSSProperties}
      >
        {subs.map(([id, label, count]) => (
          <button
            key={id}
            role="tab"
            aria-selected={sub === id}
            className={sub === id ? "is-on" : ""}
            onClick={() => setSub(id)}
          >
            {label}
            {count > 0 && <span className="subtabs__count">{count}</span>}
          </button>
        ))}
      </div>

      {sub === "plan" && (
        <>
          <ol className="timeline">
            {day.stops.map((s, i) => {
              const isDone = !!done[s.id];
              const isNow = i === currentIdx && !isDone;
              return (
                <li
                  key={s.id}
                  className={`tl tl--${s.kind}${isDone ? " is-done" : ""}${isNow ? " is-now" : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <button
                    className="tl__icon"
                    onClick={() => toggleDone(s.id)}
                    aria-pressed={isDone}
                    aria-label={isDone ? t.unmark(tc(s.title)) : t.mark(tc(s.title))}
                  >
                    <Icon name={isDone ? "check" : s.kind} size={16} />
                  </button>
                  <div className="tl__body">
                    <div className="tl__top">
                      <span className="tl__time">{starts[i].exact ? fmtMin(starts[i].min) : tc(s.time)}</span>
                      {!starts[i].exact && <span className="tl__approx">~{fmtMin(starts[i].min)}</span>}
                      <span className="tl__kind">{KIND_LABEL[s.kind]()}</span>
                      {isNow && <span className="tl__now">{t.now}</span>}
                      {s.place && (
                        <a
                          className="tl__map"
                          href={mapsSearch(s.place)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={t.onMap(tc(s.title))}
                          title={t.onMapShort}
                        >
                          <Icon name="map" size={16} />
                        </a>
                      )}
                    </div>
                    <h3>{tc(s.title)}</h3>
                    {s.detail && <p className="tl__detail">{tc(s.detail)}</p>}
                    {s.prices && s.prices.length > 0 && (
                      <div className="tl__prices">
                        {s.prices.map((p, j) => {
                          const l = priceLabel(p, tc);
                          return (
                            <span key={j} className={`price${p.free ? " price--free" : ""}`}>
                              <b>{l.main}</b>
                              {l.sub && <small>{l.sub}</small>}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {day.tips.length > 0 && (
            <section className="tips">
              <h3>{t.tips}</h3>
              <ul>
                {day.tips.map((tip, i) => (
                  <li key={i}>{tc(tip)}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
      {sub === "bookings" && <Reservations day={day} />}
      {sub === "money" && <DayExpenses date={day.date} />}
      {sub === "journal" && <Journal date={day.date} />}
    </div>
  );
}
