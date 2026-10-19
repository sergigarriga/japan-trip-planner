import { BLOCKS, BUDGET, DAYS, FLIGHTS, LOGISTICS, STAYS, TASKS, TRIP } from "../data/trip";

/** Claves de los objetos de trip.ts cuyo valor es texto visible (y por tanto traducible con `tc`). */
const TEXT_KEYS = new Set([
  "title",
  "subtitle",
  "name",
  "base",
  "detail",
  "tips",
  "warning",
  "note",
  "label",
  "concept",
  "body",
  "hint",
  "pace",
  "luggage",
  "text",
  "wish",
  "button",
  "sign",
  "city",
  "time",
  "bookings",
  "airline",
]);

const CLOCK = /^\d{1,2}:\d{2}$/;

/** Todos los textos de trip.ts que se muestran traducidos. */
export function collectTranslatable(): Set<string> {
  const found = new Set<string>();
  const walk = (value: unknown, key: string) => {
    if (typeof value === "string") {
      if (TEXT_KEYS.has(key) && value.trim() && !(key === "time" && CLOCK.test(value))) found.add(value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => walk(v, key));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, k);
    }
  };
  [TRIP, FLIGHTS, BLOCKS, DAYS, STAYS, BUDGET, LOGISTICS, TASKS].forEach((v) => walk(v, ""));
  return found;
}
