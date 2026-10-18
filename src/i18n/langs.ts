export const LANGS = ["es", "ca", "en", "fr"] as const;

export type Lang = (typeof LANGS)[number];

/** Nombre de cada idioma en su propio idioma, para el selector. */
export const LANG_NAMES: Record<Lang, string> = {
  es: "Español",
  ca: "Català",
  en: "English",
  fr: "Français",
};

/** Locale de Intl (fechas y números) para cada idioma. */
export const LOCALES: Record<Lang, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-GB",
  fr: "fr-FR",
};

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}
