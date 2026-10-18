import { useState } from "react";
import { TRIP } from "../data/trip";
import { msg, tc } from "../i18n";
import { m } from "../i18n/messages/welcome";
import { buzz, readStored, writeStored } from "../lib";
import { Sheet } from "./Sheet";

const SEEN = "welcome-seen";

/** Mensaje del primer arranque (`TRIP.welcome`). Se puede forzar con ?bienvenida=1 o desactivar con ?bienvenida=0. */
export function Welcome() {
  const welcome = TRIP.welcome;
  const t = msg(m);
  const [open, setOpen] = useState(() => {
    if (!welcome) return false;
    const param = new URLSearchParams(location.search).get("bienvenida");
    if (param === "1") return true;
    if (param === "0") return false;
    return !readStored<string | null>(SEEN, null);
  });

  if (!welcome) return null;

  const close = () => {
    writeStored(SEEN, new Date().toISOString());
    buzz(20);
    setOpen(false);
  };

  return (
    <Sheet open={open} onClose={close} title={t.title} variant="full" className="welcome">
      <div className="welcome__card">
        <p className="welcome__kanji" lang="ja" aria-hidden="true">
          {[..."日本"].map((c, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {c}
            </span>
          ))}
        </p>
        <h2 className="welcome__title">{tc(welcome.title)}</h2>
        <p className="welcome__text">{tc(welcome.text)}</p>
        {welcome.wish && <p className="welcome__wish">{tc(welcome.wish)}</p>}
        {welcome.sign && <p className="welcome__sign">{tc(welcome.sign)}</p>}
        <button className="btn btn--primary welcome__go" onClick={close} autoFocus>
          {tc(welcome.button)}
        </button>
      </div>
    </Sheet>
  );
}
