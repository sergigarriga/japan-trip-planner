import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { syncDocumentLang } from "./i18n";
import { applyBlockColors } from "./lib";
import { Root } from "./Root";
import { TripProvider } from "./state";
import "leaflet/dist/leaflet.css";
import "./styles.css";

applyBlockColors();
syncDocumentLang();
// Modo sin conexión: la web se guarda en el dispositivo y se actualiza sola cuando hay una versión nueva.
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <TripProvider>
        <Root />
      </TripProvider>
    </ErrorBoundary>
  </StrictMode>,
);
