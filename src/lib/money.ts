import { TRIP } from "../data/trip";
import { getLang, locale, msg } from "../i18n";
import { m } from "../i18n/messages/money";
import type { Day, Price } from "../types";

/** Número con separador de miles siempre (es-ES no agrupa los de 4 cifras por defecto). */
function num(n: number, decimals = 0): string {
  return new Intl.NumberFormat(locale(), { maximumFractionDigits: decimals, useGrouping: "always" }).format(n);
}

/** El inglés pone el símbolo delante ("¥1,200"); el resto, detrás ("1.200 ¥"). */
function withSymbol(amount: string, symbol: string): string {
  return getLang() === "en" ? `${symbol}${amount}` : `${amount} ${symbol}`;
}

export function yen(n: number): string {
  return withSymbol(num(Math.round(n)), "¥");
}

export function eur(n: number, decimals = 0): string {
  return withSymbol(num(n, decimals), "€");
}

export function yenToEur(n: number): number {
  return n / TRIP.yenPerEur;
}

function range(a: number, b: number, symbol: string): string {
  return withSymbol(`${num(a)}–${num(b)}`, symbol);
}

/** Etiqueta de un precio; `translate` traduce la nota (contenido del viaje). */
export function priceLabel(p: Price, translate: (s: string) => string = (s) => s): { main: string; sub?: string } {
  const note = p.note && translate(p.note);
  if (p.free) return { main: msg(m).free, sub: note };
  if (p.yen == null) return { main: note ?? "" };
  const main = p.yenMax ? range(p.yen, p.yenMax, "¥") : yen(p.yen);
  const e = p.yenMax ? range(yenToEur(p.yen), yenToEur(p.yenMax), "€") : eur(yenToEur(p.yen));
  return { main, sub: note ? `${e} · ${note}` : e };
}

/** Gasto estimado del día por persona, en yenes (mínimos de cada rango). */
export function dayTotal(day: Pick<Day, "stops">): number {
  return day.stops.reduce((sum, s) => sum + (s.prices ?? []).reduce((a, p) => a + (p.free ? 0 : (p.yen ?? 0)), 0), 0);
}
