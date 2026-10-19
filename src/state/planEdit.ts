// Edición del plan de un día: se edita el texto traducido que se ve, pero solo se guarda lo que de verdad cambia.

import { tc } from "../i18n";
import type { DayContent, PlanDay } from "./model";

/** Contenido del día tal cual está guardado (sin traducir). */
export function rawContentOf(d: PlanDay): DayContent {
  return {
    origin: d.origin,
    kanji: d.kanji,
    kana: d.kana,
    romaji: d.romaji,
    title: d.title,
    base: d.base,
    route: d.route,
    tips: d.tips,
    warning: d.warning,
    stops: d.stops,
  };
}

/** Si un texto sigue siendo la traducción del original, se guarda el original: solo se guarda lo que el usuario cambió. */
const keep = (value: string | undefined, original: string | undefined) =>
  value !== undefined && original !== undefined && value === tc(original) ? original : value;

export function restoreOriginals(content: DayContent, day: PlanDay): DayContent {
  const originalStops = new Map(day.stops.map((s) => [s.id, s]));
  return {
    ...content,
    title: keep(content.title, day.title) ?? content.title,
    base: keep(content.base, day.base) ?? content.base,
    warning: keep(content.warning, day.warning),
    tips: content.tips.map((tip, i) => keep(tip, day.tips[i]) ?? tip),
    stops: content.stops.map((s) => {
      const o = originalStops.get(s.id);
      if (!o) return s;
      return {
        ...s,
        time: keep(s.time, o.time) ?? s.time,
        title: keep(s.title, o.title) ?? s.title,
        detail: keep(s.detail, o.detail),
        prices: s.prices?.map((p, j) => ({ ...p, note: keep(p.note, o.prices?.[j]?.note) })),
      };
    }),
  };
}
