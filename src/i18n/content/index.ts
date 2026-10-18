import type { Lang } from "../langs";
import ca from "./ca";
import en from "./en";
import fr from "./fr";

/**
 * Traducciones del contenido de src/data/trip.ts: clave = texto original (en `TRIP.lang`), valor = traducción.
 * Si adaptas la guía a tu viaje, puedes borrar estos diccionarios o rehacerlos con tus textos.
 */
export const CONTENT: Partial<Record<Lang, Record<string, string>>> = { ca, en, fr };
