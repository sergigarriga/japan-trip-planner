// Idiomas de la interfaz y traducción del contenido del viaje.
//
// - Textos de la interfaz: cada componente define los suyos con `defineMessages` (src/i18n/messages/),
//   los cuatro idiomas con las mismas claves, y los lee con `msg(...)`.
// - Contenido del viaje (src/data/trip.ts): se escribe en `TRIP.lang`; `tc()` lo traduce con los
//   diccionarios de src/i18n/content/ y, si no hay traducción, devuelve el texto original.

import { useSyncExternalStore } from "react";
import { TRIP } from "../data/trip";
import { readStored, writeStored } from "../lib/browser";
import { CONTENT } from "./content";
import { LOCALES, isLang, type Lang } from "./langs";

export { LANG_NAMES, LANGS, LOCALES, isLang, type Lang } from "./langs";

const STORED = "lang";

function detect(): Lang {
  const stored = readStored<unknown>(STORED, null);
  if (isLang(stored)) return stored;
  const preferred = typeof navigator === "undefined" ? [] : (navigator.languages ?? [navigator.language]);
  for (const tag of preferred) {
    const base = tag?.toLowerCase().split("-")[0];
    if (isLang(base)) return base;
  }
  return TRIP.lang;
}

let current: Lang = detect();
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return current;
}

/** Locale de Intl del idioma actual ("es-ES", "en-GB"…). */
export function locale(): string {
  return LOCALES[current];
}

export function setLang(lang: Lang): void {
  if (lang === current) return;
  current = lang;
  writeStored(STORED, lang);
  syncDocumentLang();
  listeners.forEach((fn) => fn());
}

export function syncDocumentLang(): void {
  if (typeof document !== "undefined") document.documentElement.lang = current;
}

/** Idioma actual como estado de React: el componente se vuelve a pintar al cambiarlo. */
export function useLang(): Lang {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getLang,
    getLang,
  );
}

/* ---------- textos de la interfaz ---------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Message = string | ((...args: any[]) => string);
type Catalog = Record<string, Message>;

/** Mismas claves (y mismos parámetros) en los cuatro idiomas; el español es la referencia. */
export type Translations<T extends Catalog> = { es: T } & { [L in Exclude<Lang, "es">]: { [K in keyof T]: T[K] } };

export function defineMessages<T extends Catalog>(messages: Translations<T>): Translations<T> {
  return messages;
}

/** Textos de un catálogo en el idioma actual. */
export function msg<T extends Catalog>(messages: Translations<T>): T {
  return messages[current] as T;
}

/* ---------- contenido del viaje ---------- */

/** Traduce un texto de `trip.ts` al idioma actual (o lo devuelve tal cual si no hay traducción). */
export function tc(text: string): string;
export function tc(text: string | undefined): string | undefined;
export function tc(text: string | undefined): string | undefined {
  if (text == null || current === TRIP.lang) return text;
  return CONTENT[current]?.[text] ?? text;
}
