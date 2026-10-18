import { useEffect } from "react";
import App from "./App";
import { TRIP } from "./data/trip";
import { tc, useLang } from "./i18n";

/** Al cambiar de idioma se vuelve a montar la app; el estado del viaje (TripProvider) se conserva. */
export function Root() {
  const lang = useLang();

  useEffect(() => {
    document.title = tc(TRIP.title);
  }, [lang]);

  return <App key={lang} />;
}
