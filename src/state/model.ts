// Tipos y datos derivados del estado editable del viaje.

import { BUDGET, DAYS } from "../data/trip";
import { msg } from "../i18n";
import { m } from "../i18n/messages/expenseCats";
import type { Day, ExpenseCat, FileRef, Stop } from "../types";

export type { ExpenseCat, FileRef };

export type PlanStop = Stop & { id: string };
/** Día del plan editable: `origin` es el día original del que sale el contenido (y su ubicación). */
export type PlanDay = Omit<Day, "stops" | "geo" | "bookings"> & { origin: number; stops: PlanStop[] };
/** Lo editable de un día (la fecha y el bloque dependen de la posición). */
export type DayContent = Pick<
  PlanDay,
  "origin" | "kanji" | "kana" | "romaji" | "title" | "base" | "stops" | "route" | "tips" | "warning"
>;

export type Expense = {
  id: string;
  date: string;
  yen: number;
  cat: ExpenseCat;
  note: string;
  paidBy: 0 | 1;
  shared: boolean;
};

export type Reservation = {
  id: string;
  origin: number;
  title: string;
  code: string;
  when: string;
  note: string;
  files: FileRef[];
};
export type StayInfo = { name: string; address: string };

const CAT_LABELS: Record<ExpenseCat, () => string> = {
  stay: () => msg(m).stay,
  transport: () => msg(m).transport,
  food: () => msg(m).food,
  tickets: () => msg(m).tickets,
  shopping: () => msg(m).shopping,
  other: () => msg(m).other,
};

/** Categorías de gasto con su presupuesto por persona, sumado desde BUDGET. `label()` sale en el idioma actual. */
export const EXPENSE_CATS: { id: ExpenseCat; label: () => string; budget: number }[] = (
  Object.keys(CAT_LABELS) as ExpenseCat[]
).map((id) => ({
  id,
  label: CAT_LABELS[id],
  budget: BUDGET.filter((b) => b.cat === id).reduce((a, b) => a + b.eur, 0),
}));

/* ---------- plan base ---------- */

function toContent(d: Day): DayContent {
  return {
    origin: d.n,
    kanji: d.kanji,
    kana: d.kana,
    romaji: d.romaji,
    title: d.title,
    base: d.base,
    route: d.route,
    tips: d.tips,
    warning: d.warning,
    stops: d.stops.map((s, i) => ({ ...s, id: `${d.n}-${i}` })),
  };
}

export const BASE: DayContent[] = DAYS.map(toContent);
