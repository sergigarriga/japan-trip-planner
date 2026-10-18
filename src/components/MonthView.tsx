import { useState } from "react";
import { BLOCKS, FLIGHTS, STAYS, TRIP } from "../data/trip";
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
import { TripMap } from "./TripMap";

type Props = { selected: number; todayIso: string; theme: string; onOpen: (n: number) => void };

type Marker = "flight" | "train" | "logistics" | "alert";

const MARKER_LABEL: Record<Marker, string> = {
  flight: "Vuelo",
  train: "Tren largo",
  logistics: "Maletas",
  alert: "Revisar",
};

const WEEK = ["L", "M", "X", "J", "V", "S", "D"];
/** Día en que se aterriza en casa (fuera del plan, se marca en el calendario). */
const RETURN_ARRIVAL = FLIGHTS[FLIGHTS.length - 1]?.to.date ?? TRIP.end;

function markers(day: PlanDay): Marker[] {
  const m: Marker[] = [];
  if (day.stops.some((s) => s.kind === "flight")) m.push("flight");
  if (day.stops.some((s) => s.kind === "train" && (s.prices ?? []).some((p) => (p.yen ?? 0) >= 5000))) m.push("train");
  if (day.stops.some((s) => s.kind === "logistics" && /maleta|takkyubin/i.test(s.title))) m.push("logistics");
  if (day.warning) m.push("alert");
  return m;
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
          <p className="muted">
            {DAYS.length - 1} días en Japón, {totalNights} noches
          </p>
        </header>

        <div className="cal" role="grid" aria-label="Calendario del viaje">
          {WEEK.map((w, i) => (
            <span key={w} className={`cal__wd${i >= 5 ? " is-weekend" : ""}`} role="columnheader">
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

            const m = markers(day);
            return (
              <button
                key={date}
                role="gridcell"
                data-block={day.block}
                className={`cal__cell${day.n === preview ? " is-sel" : ""}${date === todayIso ? " is-today" : ""}`}
                style={{ "--i": i } as React.CSSProperties}
                onClick={() => setPreview(day.n)}
                onDoubleClick={() => onOpen(day.n)}
                aria-label={`${longDate(date)}: ${day.title}`}
                aria-selected={day.n === preview}
              >
                <span className={`cal__num${weekend ? " is-weekend" : ""}`}>{d}</span>
                <span className="cal__kanji">{day.kanji}</span>
                <span className="cal__title">{day.title}</span>
                {m.length > 0 && (
                  <span className="cal__marks">
                    {m.map((k) => (
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
                {b.name}
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
              {MARKER_LABEL[k]}
            </li>
          ))}
        </ul>
      </section>

      <article className="panel peek" data-block={previewDay.block} key={previewDay.n}>
        <span className="peek__kanji" aria-hidden="true">
          {previewDay.kanji}
        </span>
        <p className="peek__meta">
          <span>{previewBlock.name}</span>
          Día {previewDay.n}, {longDate(previewDay.date).toLowerCase()}
        </p>
        <h3 className="peek__title">{previewDay.title}</h3>
        <dl className="peek__facts">
          <div>
            <dt>Dormís en</dt>
            <dd>{previewDay.base}</dd>
          </div>
          <div>
            <dt>Paradas</dt>
            <dd>{previewDay.stops.length}</dd>
          </div>
          {previewTotal > 0 && (
            <div>
              <dt>Gasto</dt>
              <dd>
                ~{yen(previewTotal)} <span className="muted">({eur(yenToEur(previewTotal))})</span>
              </dd>
            </div>
          )}
        </dl>
        <ol className="peek__stops">
          {previewDay.stops.slice(0, 4).map((s, i) => (
            <li key={i}>
              <span>{s.time}</span>
              {s.title}
            </li>
          ))}
          {previewDay.stops.length > 4 && <li className="muted">y {previewDay.stops.length - 4} más</li>}
        </ol>
        {previewMarkers.includes("alert") && (
          <p className="peek__warn">
            <Icon name="alert" size={14} />
            Este día tiene un aviso por revisar.
          </p>
        )}
        <button className="btn btn--primary" onClick={() => onOpen(previewDay.n)}>
          Abrir día {previewDay.n}
        </button>
      </article>

      <section className="panel">
        <h2>Mapa del viaje</h2>
        <p className="muted">Toca un punto para abrir ese día.</p>
        <TripMap theme={theme} onOpen={onOpen} />
      </section>

      <section className="panel">
        <h2>Dónde dormís</h2>
        <p className="muted">
          {totalNights} noches, del {shortDate(STAYS[0].from)} al {shortDate(stayEnd)}
        </p>
        <div className="stays" aria-hidden="true">
          {STAYS.map((s) => (
            <span
              key={s.from}
              className="stays__bar"
              data-block={s.block}
              style={{ flexGrow: s.nights }}
              title={`${s.city}: ${s.nights} noches`}
            />
          ))}
        </div>
        <ul className="stays__list">
          {STAYS.map((s) => (
            <li key={s.from} data-block={s.block}>
              <strong>{s.kanji}</strong>
              <span>{s.city}</span>
              <small>
                {parseDate(s.from).getDate()}–{shortDate(addDays(s.from, s.nights))}
              </small>
              <b>
                {s.nights} {s.nights === 1 ? "noche" : "noches"}
              </b>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
