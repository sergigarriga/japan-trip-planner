import { locale } from "../i18n";

const fmt = (options: Intl.DateTimeFormatOptions) => (d: Date) => new Intl.DateTimeFormat(locale(), options).format(d);
const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase(locale()) + s.slice(1);

const pad = (n: number) => String(n).padStart(2, "0");

/** Convierte "YYYY-MM-DD" en una fecha local (sin desfases de zona horaria). */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIso(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayIso(): string {
  return toIso(new Date());
}

/** "domingo" en el idioma actual */
export function weekday(iso: string): string {
  return fmt({ weekday: "long" })(parseDate(iso));
}

/** "noviembre" en el idioma actual */
export function monthName(iso: string): string {
  return fmt({ month: "long" })(parseDate(iso));
}

/** "21 nov" en el idioma actual */
export function shortDate(iso: string): string {
  return fmt({ day: "numeric", month: "short" })(parseDate(iso)).replace(/\.$/, "");
}

/** "Domingo, 21 de noviembre" en el idioma actual */
export function longDate(iso: string): string {
  return capitalize(fmt({ weekday: "long", day: "numeric", month: "long" })(parseDate(iso)));
}

export function daysBetween(fromIso: string, toIsoDate: string): number {
  return Math.round((parseDate(toIsoDate).getTime() - parseDate(fromIso).getTime()) / 86_400_000);
}

export function addDays(iso: string, n: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + n);
  return toIso(d);
}

/** Lunes (0) a domingo (6). */
export function weekdayIndex(iso: string): number {
  return (parseDate(iso).getDay() + 6) % 7;
}

/** Instante UTC (ms) de una fecha y hora de reloj en una zona horaria IANA. */
export function zonedTime(date: string, time: string, timeZone: string): number {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const asUtc = Date.UTC(y, mo - 1, d, h, mi);
  // Desfase de la zona en ese momento: se calcula dos veces por si se cruza un cambio de hora.
  const offset = (t: number) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .formatToParts(t)
        .map((x) => [x.type, Number(x.value)]),
    );
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - t;
  };
  const guess = asUtc - offset(asUtc);
  return asUtc - offset(guess);
}

/** Fecha y minuto actuales en Japón. */
export function jstNow(now = new Date()): { date: string; min: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, min: Number(parts.hour) * 60 + Number(parts.minute) };
}
