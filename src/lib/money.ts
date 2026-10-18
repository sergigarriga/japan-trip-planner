import { TRIP } from "../data/trip";
import type { Day, Price } from "../types";

// es-ES no agrupa números de 4 cifras; forzamos el punto de miles.
const groupThousands = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const eurFmt = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 });

export function yen(n: number): string {
  return `${groupThousands(n)} ¥`;
}

export function eur(n: number): string {
  return `${eurFmt.format(n)} €`;
}

export function yenToEur(n: number): number {
  return n / TRIP.yenPerEur;
}

export function priceLabel(p: Price): { main: string; sub?: string } {
  if (p.free) return { main: "Gratis", sub: p.note };
  if (p.yen == null) return { main: p.note ?? "" };
  const main = p.yenMax ? `${groupThousands(p.yen)}–${yen(p.yenMax)}` : yen(p.yen);
  const e = p.yenMax ? `${eurFmt.format(yenToEur(p.yen))}–${eur(yenToEur(p.yenMax))}` : eur(yenToEur(p.yen));
  return { main, sub: p.note ? `${e} · ${p.note}` : e };
}

/** Gasto estimado del día por persona, en yenes (mínimos de cada rango). */
export function dayTotal(day: Pick<Day, "stops">): number {
  return day.stops.reduce((sum, s) => sum + (s.prices ?? []).reduce((a, p) => a + (p.free ? 0 : (p.yen ?? 0)), 0), 0);
}
