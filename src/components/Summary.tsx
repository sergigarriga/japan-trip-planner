import { useState } from "react";
import { TRIP } from "../data/trip";
import { msg, tc } from "../i18n";
import { m } from "../i18n/messages/summary";
import { buzz, daysBetween, eur, todayIso, yenToEur } from "../lib";
import { useTrip } from "../state";
import { Icon } from "./Icon";
import { JapanMap } from "./JapanMap";

export function Summary({ onCountdown }: { onCountdown: () => void }) {
  const { days, done, expenses, photos } = useTrip();
  const [shared, setShared] = useState(false);
  const t = msg(m);
  const today = todayIso();

  const lived = days.filter((d) => d.n > 0 && d.date <= today);
  const progress = lived.length ? lived[lived.length - 1].n : -1;
  const allStops = days.flatMap((d) => d.stops);
  const doneStops = allStops.filter((s) => done[s.id]);
  const visits = doneStops.filter((s) => s.kind === "visit").length;
  const spent = yenToEur(expenses.reduce((a, e) => a + e.yen, 0) / TRIP.travellers.length);
  const photoCount = Object.values(photos).reduce((a, l) => a + l.length, 0);
  const places = new Set(lived.map((d) => d.kanji)).size;
  const before = daysBetween(today, days[0].date) > 0;

  const stats = [
    { v: `${lived.length}/${days.length - 1}`, l: t.daysLived },
    { v: `${doneStops.length}`, l: t.ofStops(allStops.length) },
    { v: `${visits}`, l: t.visits },
    { v: `${places}`, l: t.places },
    { v: eur(spent), l: t.spent },
    { v: `${photoCount}`, l: t.photos },
  ];

  const share = async () => {
    const title = tc(TRIP.title);
    const text = t.shareText(title, lived.length, doneStops.length, visits, places, photoCount);
    try {
      if (navigator.share) await navigator.share({ title: t.shareTitle(title), text });
      else {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
      buzz();
    } catch {
      /* compartir cancelado */
    }
  };

  return (
    <section className="panel summary">
      <div className="summary__head">
        <h2>{before ? t.yourTrip : t.tripSummary}</h2>
        {before ? (
          <button className="chip" onClick={onCountdown}>
            {t.countdown}
          </button>
        ) : (
          <button className="chip" onClick={share}>
            <Icon name="share" size={14} /> {shared ? t.copied : t.share}
          </button>
        )}
      </div>
      <div className="summary__body">
        <JapanMap progress={progress} />
        <dl className="summary__stats">
          {stats.map((s) => (
            <div key={s.l}>
              <dt>{s.l}</dt>
              <dd>{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
