const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

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

export function weekday(iso: string): string {
  return WEEKDAYS[parseDate(iso).getDay()];
}

/** "noviembre" */
export function monthName(iso: string): string {
  return MONTHS[parseDate(iso).getMonth()];
}

/** "21 nov" */
export function shortDate(iso: string): string {
  const d = parseDate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

/** "Domingo 21 de noviembre" */
export function longDate(iso: string): string {
  const d = parseDate(iso);
  const wd = WEEKDAYS[d.getDay()];
  return `${wd[0].toUpperCase()}${wd.slice(1)} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
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
