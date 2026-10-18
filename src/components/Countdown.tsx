import { FLIGHTS, TRIP } from "../data/trip";
import { useNow } from "../hooks";
import { msg, tc } from "../i18n";
import { m } from "../i18n/messages/countdown";
import { longDate, zonedTime } from "../lib";
import { JapanMap } from "./JapanMap";
import { Sheet } from "./Sheet";

const OUTBOUND = FLIGHTS[0];
const DEPARTURE = zonedTime(OUTBOUND.date, OUTBOUND.from.time, TRIP.home.timeZone);

export function Countdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const now = useNow(1000);
  const t = msg(m);
  const diff = Math.max(0, DEPARTURE - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const mins = Math.floor(diff / 60_000) % 60;
  const secs = Math.floor(diff / 1000) % 60;
  const units = [
    [hours, t.hours],
    [mins, t.mins],
    [secs, t.secs],
  ] as const;

  return (
    <Sheet open={open} onClose={onClose} title={t.title} variant="full" className="countdown">
      <div className="cd">
        <p className="cd__jp" lang="ja">
          日本まで
        </p>
        <p className="cd__days">
          <strong>{days}</strong>
          <span>{t.days}</span>
        </p>
        <div className="cd__units">
          {units.map(([v, l]) => (
            <div key={l}>
              <strong>{String(v).padStart(2, "0")}</strong>
              <small>{l}</small>
            </div>
          ))}
        </div>
        <JapanMap progress={-1} animate />
        <p className="muted cd__foot">{t.foot(longDate(OUTBOUND.date), OUTBOUND.from.time, tc(OUTBOUND.from.city))}</p>
      </div>
    </Sheet>
  );
}
