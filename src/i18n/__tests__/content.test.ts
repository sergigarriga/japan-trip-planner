import { describe, expect, it } from "vitest";
import { collectTranslatable } from "../../test/collect";
import { CONTENT } from "../content";

// Las traducciones del viaje de ejemplo deben cubrir todos los textos de trip.ts, sin entradas huérfanas.
// Si adaptas la guía a tu viaje, vacía los diccionarios de src/i18n/content/ (o rehazlos) y este test seguirá pasando.
const texts = collectTranslatable();

describe.each(Object.entries(CONTENT))("traducción del contenido: %s", (_lang, dict) => {
  const translations = dict ?? {};
  const empty = Object.keys(translations).length === 0;

  it.skipIf(empty)("traduce todos los textos de trip.ts", () => {
    expect([...texts].filter((t) => !(t in translations))).toEqual([]);
  });

  it.skipIf(empty)("no tiene entradas que ya no existan en trip.ts", () => {
    expect(Object.keys(translations).filter((k) => !texts.has(k))).toEqual([]);
  });

  it("no tiene traducciones vacías", () => {
    expect(Object.entries(translations).filter(([, v]) => !v.trim())).toEqual([]);
  });
});
