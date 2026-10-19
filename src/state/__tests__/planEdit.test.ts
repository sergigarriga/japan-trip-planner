import { afterEach, describe, expect, it } from "vitest";
import { DAYS } from "../../data/trip";
import { setLang, tc } from "../../i18n";
import { BASE, type PlanDay } from "../model";
import { rawContentOf, restoreOriginals } from "../planEdit";

const day = (n: number): PlanDay => {
  const content = BASE[n];
  return { n, date: DAYS[n].date, block: DAYS[n].block, ...content };
};

/** Lo que el editor tendría como borrador: el contenido ya traducido. */
const translated = (d: PlanDay) => {
  const tr = (s: string | undefined) => (s === undefined ? s : tc(s));
  return {
    ...rawContentOf(d),
    title: tr(d.title)!,
    base: tr(d.base)!,
    tips: d.tips.map((x) => tr(x)!),
    warning: tr(d.warning),
    stops: d.stops.map((s) => ({ ...s, time: tr(s.time)!, title: tr(s.title)!, detail: tr(s.detail) })),
  };
};

afterEach(() => setLang("es"));

describe("edición del plan en otro idioma", () => {
  it("si no se cambia nada, el resultado es idéntico al original", () => {
    setLang("en");
    const d = day(3);
    const next = restoreOriginals(translated(d), d);
    expect(JSON.stringify(next)).toBe(JSON.stringify(rawContentOf(d)));
  });

  it("solo guarda como nuevo lo que el usuario ha cambiado", () => {
    setLang("fr");
    const d = day(3);
    const draft = translated(d);
    draft.title = "Mi título";
    const next = restoreOriginals(draft, d);
    expect(next.title).toBe("Mi título");
    expect(next.base).toBe(d.base);
    expect(next.stops[0].title).toBe(d.stops[0].title);
    expect(next.tips).toEqual(d.tips);
  });
});
