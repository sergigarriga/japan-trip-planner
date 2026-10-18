import { BLOCKS, BUDGET, DAYS, FLIGHTS, LOGISTICS, TRIP } from "../data/trip";
import { locale, msg, tc } from "../i18n";
import { m } from "../i18n/messages/tripView";
import { buildIcs, downloadFile, eur, shortDate, slug, weekday } from "../lib";
import { useTrip } from "../state";
import { ExpenseReport } from "./Expenses";
import { Icon } from "./Icon";
import { Summary } from "./Summary";

/** Fecha y hora de la compilación, en el idioma actual. */
const buildDate = () =>
  new Intl.DateTimeFormat(locale(), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TRIP.home.timeZone,
  }).format(new Date(__BUILD_TIME__));

export function TripView({ onCountdown }: { onCountdown: () => void }) {
  const { days } = useTrip();
  const t = msg(m);
  const total = BUDGET.reduce((a, b) => a + b.eur, 0);
  const max = Math.max(...BUDGET.map((b) => b.eur));

  return (
    <div className="trip">
      <Summary onCountdown={onCountdown} />
      <ExpenseReport />

      <section className="panel">
        <h2>{t.calendar}</h2>
        <p className="muted">{t.calendarText}</p>
        <button
          className="btn btn--primary cal-export"
          onClick={() => downloadFile(`${slug(tc(TRIP.title))}.ics`, buildIcs(days, tc))}
        >
          <Icon name="calendar" />
          {t.calendarAdd}
        </button>
      </section>

      <section className="panel">
        <h2>{t.flights}</h2>
        <p className="muted">{TRIP.travellers.join(t.and)}</p>
        <div className="flights">
          {FLIGHTS.map((f) => (
            <article key={f.label} className="ticket">
              <p className="ticket__label">
                {tc(f.label)} · {weekday(f.date)} {shortDate(f.date)}
              </p>
              <div className="ticket__row">
                <div>
                  <strong>{f.from.code}</strong>
                  <span>{f.from.time}</span>
                  <small>{tc(f.from.city)}</small>
                </div>
                <div className="ticket__via">
                  <span />
                  {f.via && <small>{t.via(f.via)}</small>}
                </div>
                <div className="ticket__to">
                  <strong>{f.to.code}</strong>
                  <span>{f.to.time}</span>
                  <small>
                    {tc(f.to.city)}, {weekday(f.to.date)} {shortDate(f.to.date)}
                  </small>
                </div>
              </div>
              <p className="ticket__foot">{tc(f.airline)}</p>
            </article>
          ))}
        </div>
        <dl className="facts">
          <div>
            <dt>{t.luggage}</dt>
            <dd>{tc(TRIP.luggage)}</dd>
          </div>
          <div>
            <dt>{t.pace}</dt>
            <dd>{tc(TRIP.pace)}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <h2>{t.route}</h2>
        <ol className="blocks">
          {BLOCKS.map((b) => {
            const days = DAYS.filter((d) => d.block === b.id && d.n > 0);
            return (
              <li key={b.id} data-block={b.id}>
                <span className="blocks__code">{b.code}</span>
                <div>
                  <strong>{tc(b.name)}</strong>
                  <p className="muted">
                    {t.days(days[0].n, days[days.length - 1].n)} · {tc(b.subtitle)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="panel">
        <h2>{t.budget}</h2>
        <p className="budget__total">
          {eur(total)} <span className="muted">{t.budgetTotal}</span>
        </p>
        <ul className="budget">
          {BUDGET.map((b) => (
            <li key={b.concept}>
              <div className="budget__row">
                <span>{tc(b.concept)}</span>
                <b>{b.eur ? eur(b.eur) : t.paid}</b>
              </div>
              <div className="budget__bar">
                <span style={{ width: `${(b.eur / max) * 100}%` }} />
              </div>
              <small className="muted">{tc(b.detail)}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>{t.logistics}</h2>
        <ul className="logistics">
          {LOGISTICS.map((l) => (
            <li key={l.title}>
              <strong>{tc(l.title)}</strong>
              <p>{tc(l.body)}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="build">{t.build(buildDate())}</p>
    </div>
  );
}
