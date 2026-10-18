/** Hora de inicio por defecto de cada franja horaria. */
const LABEL_START: Record<string, string> = {
  Amanecer: "06:30",
  Mañana: "09:00",
  Mediodía: "13:00",
  Tarde: "15:30",
  Atardecer: "16:15",
  Noche: "19:30",
  "Todo el día": "08:00",
  Llegada: "16:00",
};

const HHMM = /^\d{1,2}:\d{2}$/;

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fmtMin(min: number): string {
  const h = Math.floor(min / 60) % 24;
  return `${String(h).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** Minuto de inicio de cada parada. Las franjas ("Mañana") se reparten sin solaparse. */
export function stopStarts(stops: { time: string; start?: string }[]): { min: number; exact: boolean }[] {
  let prev = -1;
  return stops.map((s) => {
    const explicit = s.start && HHMM.test(s.start) ? s.start : HHMM.test(s.time) ? s.time : undefined;
    let min = toMin(explicit ?? LABEL_START[s.time] ?? "09:00");
    if (!explicit && min <= prev) min = prev + 75;
    prev = min;
    return { min, exact: !!explicit };
  });
}
