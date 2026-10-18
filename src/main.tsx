import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TRIP } from "./data/trip";
import { applyBlockColors } from "./lib";
import { TripProvider } from "./state";
import "leaflet/dist/leaflet.css";
import "./styles.css";

document.title = TRIP.title;
applyBlockColors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TripProvider>
      <App />
    </TripProvider>
  </StrictMode>,
);
