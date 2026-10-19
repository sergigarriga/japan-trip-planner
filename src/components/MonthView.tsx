import { lazy, Suspense, useState } from "react";
import { BLOCKS, FLIGHTS, STAYS, TRIP } from "../data/trip";
import { msg, tc } from "../i18n";
import { m } from "../i18n/messages/monthView";
import type { PlanDay } from "../state";
import {
  addDays,
  dayTotal,
  daysBetween,
  eur,
  longDate,
  monthName,
  parseDate,
  shortDate,
  weekdayIndex,
  yen,
  yenToEur,
} from "../lib";
import { useTrip } from "../state";
import { Icon } from "./Icon";

// Leaflet pesa: el mapa se descarga solo al abrir esta vista.
const TripMap = lazy(() => import("./TripMap").then((mod) => ({ default: mod.TripMap })));

type Props = { selected: number; todayIso: string; theme: string; onOpen: (n: number) => void };

type Marker = "flight" | "train" | "logistics" | "alert";

const MARKER_LABEL: Record<Marker, () => string> = {
  flight: () => msg(m).markerFlight,
  train: () => msg(m).markerTrain,
  logistics: () => msg(m).markerLogistics,
  alert: () => msg(m).markerAlert,
};

/** Iniciales de los días de la semana, de lunes a domingo, en el idioma actual. */
const week = () => msg(m).week.split(" ");
/** Día en que se aterriza en casa (fuera del plan, se marca en el calendario). */
const RETURN_ARRIVAL = FLIGHTS[FLIGHTS.length - 1]?.to.date ?? TRIP.end;

function markers(day: PlanDay): Marker[] {
  const out: Marker[] = [];
  if (day.stops.some((s) => s.kind === "flight")) out.push("flight");
  if (day.stops.some((s) => s.kind === "train" && (s.prices ?? []).some((p) => (p.yen ?? 0) >= 5000)))
    out.push("train");
  if (day.stops.some((s) => s.kind === "logistics" && /maleta|takkyubin/i.test(s.title))) out.push("logistics");
  if (day.warning) out.push("alert");
  return out;
}

/** Semanas completas (de lunes a domingo) que cubren el viaje. */
function calendarCells(first: string, last: string): string[] {
  const start = addDays(first, -weekdayIndex(first));
  const end = addDays(last, 6 - weekdayIndex(last));
  return Array.from({ length: daysBetween(start, end) + 1 }, (_, i) => addDays(start, i));
}

/** "Noviembre 2027" o "Octubre – noviembre 2027" */
function rangeTitle(first: string, last: string): string {
  const [a, b] = [monthName(first), monthName(last)];
  const year = parseDate(last).getFullYear();
  const label = a === b ? `${a} ${year}` : `${a} – ${b} ${year}`;
  return label[0].toUpperCase() + label.slice(1);
}

export function MonthView({ selected, todayIso, theme, onOpen }: Props) {
  const { days: DAYS } = useTrip();
  const t = msg(m);
  const [preview, setPreview] = useState(selected);
  const previewDay = DAYS.find((d) => d.n === preview) ?? DAYS[1];
  const previewBlock = BLOCKS.find((b) => b.id === previewDay.block)!;

  const lastDate = RETURN_ARRIVAL > DAYS[DAYS.length - 1].date ? RETURN_ARRIVAL : DAYS[DAYS.length - 1].date;
  const cells = calendarCells(DAYS[0].date, lastDate);
  const stayEnd = addDays(STAYS[STAYS.length - 1].from, STAYS[STAYS.length - 1].nights);

  const totalNights = STAYS.reduce((a, s) => a + s.nights, 0);
  const previewTotal = dayTotal(previewDay);
  const previewMarkers = markers(previewDay);

  return (
    <div className="month">
      <section className="panel month__cal">
        <header className="month__head">
          <h2>{rangeTitle(DAYS[0].date, lastDate)}</h2>
          <p className="muted">{t.summary(DAYS.length - 1, totalNights)}</p>
        </header>

        <div className="cal" role="group" aria-label={t.calendar}>
          {week().map((w, i) => (
            <span key={i} className={`cal__wd${i >= 5 ? " is-weekend" : ""}`} aria-hidden="true">
              {w}
            </span>
          ))}
          {cells.map((date, i) => {
            const d = parseDate(date).getDate();
            const day = DAYS.find((x) => x.date === date);
            const isReturn = date === RETURN_ARRIVAL;
            const weekend = parseDate(date).getDay() % 6 === 0;

            if (!day) {
              return (
                <div
                  key={date}
                  className={`cal__cell is-off${isReturn ? " is-return" : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span className={`cal__num${weekend ? " is-weekend" : ""}`}>{d}</span>
                  {isReturn && (
                    <>
                      <span className="cal__kanji cal__kanji--home">{TRIP.home.code}</span>
                      <span className="cal__marks">
                        <span className="mk mk--flight">
                          <Icon name="flight" size={11} />
                        </span>
                      </span>
                    </>
                  )}
                </div>
              );
            }

            const marks = markers(day);
            return (
              <button
                key={date}
                data-block={day.block}
                className={`cal__cell${day.n === preview ? " is-sel" : ""}${date === todayIso ? " is-today" : ""}`}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => setPreview(day.n)}
                onDoubleClick={() => onOpen(day.n)}
                aria-label={`${longDate(date)}: ${tc(day.title)}`}
                aria-pressed={day.n === preview}
              >
                <span className={`cal__num${weekend ? " is-weekend" : ""}`}>{d}</span>
                <span className="cal__kanji">{day.kanji}</span>
                <span className="cal__title">{tc(day.title)}</span>
                {marks.length > 0 && (
                  <span className="cal__marks">
                    {marks.map((k) => (
                      <span key={k} className={`mk mk--${k}`}>
                        <Icon name={k} size={11} />
                      </span>
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <ul className="legend">
          {BLOCKS.map((b) => {
            const ds = DAYS.filter((d) => d.block === b.id);
            return (
              <li key={b.id} data-block={b.id}>
                <span className="legend__sw" />
                {tc(b.name)}
                <small>
                  {parseDate(ds[0].date).getDate()}–{parseDate(ds[ds.length - 1].date).getDate()}
                </small>
              </li>
            );
          })}
        </ul>
        <ul className="legend legend--marks">
          {(Object.keys(MARKER_LABEL) as Marker[]).map((k) => (
            <li key={k}>
              <span className={`mk mk--${k}`}>
                <Icon name={k} size={11} />
              </span>
              {MARKER_LABEL[k]()}
            </li>
          ))}
        </ul>
      </section>

      <article className="panel peek" data-block={previewDay.block} data-kanji={previewDay.kanji} key={previewDay.n}>
        <p className="peek__meta">
          <span>{tc(previewBlock.name)}</span>
          {t.peekDate(previewDay.n, longDate(previewDay.date))}
        </p>
        <h3 className="peek__title">{tc(previewDay.title)}</h3>
        <dl className="peek__facts">
          <div>
            <dt>{t.sleepIn}</dt>
            <dd>{tc(previewDay.base)}</dd>
          </div>
          <div>
            <dt>{t.stops}</dt>
            <dd>{previewDay.stops.length}</dd>
          </div>
          {previewTotal > 0 && (
            <div>
              <dt>{t.spend}</dt>
              <dd>
                ~{yen(previewTotal)} <span className="muted">({eur(yenToEur(previewTotal))})</span>
              </dd>
            </div>
          )}
        </dl>
        <ol className="peek__stops">
          {previewDay.stops.slice(0, 4).map((s, i) => (
            <li key={i}>
              <span>{tc(s.time)}</span>
              {tc(s.title)}
            </li>
          ))}
          {previewDay.stops.length > 4 && <li className="muted">{t.more(previewDay.stops.length - 4)}</li>}
        </ol>
        {previewMarkers.includes("alert") && (
          <p className="peek__warn">
            <Icon name="alert" size={14} />
            {t.warning}
          </p>
        )}
        <button className="btn btn--primary" onClick={() => onOpen(previewDay.n)}>
          {t.open(previewDay.n)}
        </button>
      </article>

      <section className="panel month__map">
        <h2>{t.mapTitle}</h2>
        <p className="muted">{t.mapHint}</p>
        <Suspense fallback={<div className="tripmap" aria-busy="true" />}>
          <TripMap theme={theme} onOpen={onOpen} />
        </Suspense>
      </section>

      <section className="panel month__stays">
        <h2>{t.staysTitle}</h2>
        <p className="muted">{t.staysSummary(totalNights, shortDate(STAYS[0].from), shortDate(stayEnd))}</p>
        <div className="stays" aria-hidden="true">
          {STAYS.map((s) => (
            <span
              key={s.from}
              className="stays__bar"
              data-block={s.block}
              style={{ flexGrow: s.nights }}
              title={t.stayBar(tc(s.city), s.nights)}
            />
          ))}
        </div>
        <ul className="stays__list">
          {STAYS.map((s) => (
            <li key={s.from} data-block={s.block}>
              <strong>{s.kanji}</strong>
              <span>{tc(s.city)}</span>
              <small>
                {parseDate(s.from).getDate()}–{shortDate(addDays(s.from, s.nights))}
              </small>
              <b>{t.nights(s.nights)}</b>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
