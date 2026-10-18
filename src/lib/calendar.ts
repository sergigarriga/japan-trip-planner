import { TRIP } from "../data/trip";
import { stopStarts } from "./schedule";

type IcsDay = {
  date: string;
  stops: { id?: string; title: string; time: string; start?: string; detail?: string; place?: string }[];
};

const JST_OFFSET_MS = 9 * 3600_000;

const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const icsUtc = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

function icsStamp(date: string, min: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return icsUtc(new Date(Date.UTC(y, m - 1, d, 0, min) - JST_OFFSET_MS));
}

/** Calendario .ics con todas las paradas en hora de Japón y aviso 30 minutos antes; `translate` traduce el contenido. */
export function buildIcs(days: IcsDay[], translate: (s: string) => string = (s) => s, now = new Date()): string {
  const stamp = icsUtc(now);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//${TRIP.id}//ES`, "CALSCALE:GREGORIAN"];
  for (const day of days) {
    const starts = stopStarts(day.stops);
    day.stops.forEach((s, i) => {
      const start = starts[i].min;
      const end = starts[i + 1] && starts[i + 1].min > start ? starts[i + 1].min : start + 60;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${day.date}-${s.id ?? i}@${TRIP.id}`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${icsStamp(day.date, start)}`,
        `DTEND:${icsStamp(day.date, end)}`,
        `SUMMARY:${icsText(translate(s.title))}`,
        ...(s.place ? [`LOCATION:${icsText(s.place)}`] : []),
        ...(s.detail ? [`DESCRIPTION:${icsText(translate(s.detail))}`] : []),
        "BEGIN:VALARM",
        "TRIGGER:-PT30M",
        "ACTION:DISPLAY",
        `DESCRIPTION:${icsText(translate(s.title))}`,
        "END:VALARM",
        "END:VEVENT",
      );
    });
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/** "Japón 2027" ➔ "japon-2027" */
export function slug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
