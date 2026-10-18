import { BLOCKS, BUDGET, DAYS, FLIGHTS, LOGISTICS, TRIP } from "../data/trip";
import { buildIcs, downloadFile, eur, shortDate, slug, weekday } from "../lib";
import { useTrip } from "../state";
import { ExpenseReport } from "./Expenses";
import { Icon } from "./Icon";
import { Summary } from "./Summary";

const BUILD = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TRIP.home.timeZone,
}).format(new Date(__BUILD_TIME__));

export function TripView({ onCountdown }: { onCountdown: () => void }) {
  const { days } = useTrip();
  const total = BUDGET.reduce((a, b) => a + b.eur, 0);
  const max = Math.max(...BUDGET.map((b) => b.eur));

  return (
    <div className="trip">
      <Summary onCountdown={onCountdown} />
      <ExpenseReport />

      <section className="panel">
        <h2>Calendario</h2>
        <p className="muted">
          Todas las paradas del viaje en tu calendario, en hora de Japón y con aviso 30 minutos antes.
        </p>
        <button
          className="btn btn--primary cal-export"
          onClick={() => downloadFile(`${slug(TRIP.title)}.ics`, buildIcs(days))}
        >
          <Icon name="calendar" />
          Añadir el viaje al calendario
        </button>
      </section>

      <section className="panel">
        <h2>Vuelos</h2>
        <p className="muted">{TRIP.travellers.join(" y ")}</p>
        <div className="flights">
          {FLIGHTS.map((f) => (
            <article key={f.label} className="ticket">
              <p className="ticket__label">
                {f.label} · {weekday(f.date)} {shortDate(f.date)}
              </p>
              <div className="ticket__row">
                <div>
                  <strong>{f.from.code}</strong>
                  <span>{f.from.time}</span>
                  <small>{f.from.city}</small>
                </div>
                <div className="ticket__via">
                  <span />
                  {f.via && <small>vía {f.via}</small>}
                </div>
                <div className="ticket__to">
                  <strong>{f.to.code}</strong>
                  <span>{f.to.time}</span>
                  <small>
                    {f.to.city}, {weekday(f.to.date)} {shortDate(f.to.date)}
                  </small>
                </div>
              </div>
              <p className="ticket__foot">{f.airline}</p>
            </article>
          ))}
        </div>
        <dl className="facts">
          <div>
            <dt>Equipaje</dt>
            <dd>{TRIP.luggage}</dd>
          </div>
          <div>
            <dt>Ritmo</dt>
            <dd>{TRIP.pace}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <h2>Ruta</h2>
        <ol className="blocks">
          {BLOCKS.map((b) => {
            const days = DAYS.filter((d) => d.block === b.id && d.n > 0);
            return (
              <li key={b.id} data-block={b.id}>
                <span className="blocks__code">{b.code}</span>
                <div>
                  <strong>{b.name}</strong>
                  <p className="muted">
                    Días {days[0].n}–{days[days.length - 1].n} · {b.subtitle}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="panel">
        <h2>Presupuesto por persona</h2>
        <p className="budget__total">
          {eur(total)} <span className="muted">estimado total</span>
        </p>
        <ul className="budget">
          {BUDGET.map((b) => (
            <li key={b.concept}>
              <div className="budget__row">
                <span>{b.concept}</span>
                <b>{b.eur ? eur(b.eur) : "Pagado"}</b>
              </div>
              <div className="budget__bar">
                <span style={{ width: `${(b.eur / max) * 100}%` }} />
              </div>
              <small className="muted">{b.detail}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>Logística</h2>
        <ul className="logistics">
          {LOGISTICS.map((l) => (
            <li key={l.title}>
              <strong>{l.title}</strong>
              <p>{l.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="build">Versión publicada el {BUILD}</p>
    </div>
  );
}
