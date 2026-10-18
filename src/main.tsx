import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { syncDocumentLang } from "./i18n";
import { applyBlockColors } from "./lib";
import { Root } from "./Root";
import { TripProvider } from "./state";
import "leaflet/dist/leaflet.css";
import "./styles.css";

applyBlockColors();
syncDocumentLang();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TripProvider>
      <Root />
    </TripProvider>
  </StrictMode>,
);
