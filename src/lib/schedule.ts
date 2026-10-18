/** Hora de inicio por defecto de cada franja horaria, con su nombre en los idiomas soportados. */
const SLOTS: [start: string, names: string[]][] = [
  ["06:30", ["amanecer", "alba", "sunrise", "dawn", "aube", "lever du soleil"]],
  ["08:00", ["todo el día", "tot el dia", "all day", "toute la journée"]],
  ["09:00", ["mañana", "matí", "morning", "matin"]],
  ["13:00", ["mediodía", "migdia", "midday", "noon", "midi"]],
  ["15:30", ["tarde", "tarda", "afternoon", "après-midi"]],
  ["16:00", ["llegada", "arribada", "arrival", "arrivée"]],
  ["16:15", ["atardecer", "capvespre", "posta de sol", "sunset", "coucher du soleil"]],
  ["19:30", ["noche", "nit", "vespre", "evening", "night", "soir", "nuit"]],
];

const LABEL_START = new Map(SLOTS.flatMap(([start, names]) => names.map((name) => [name, start] as const)));

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
    let min = toMin(explicit ?? LABEL_START.get(s.time.trim().toLowerCase()) ?? "09:00");
    if (!explicit && min <= prev) min = prev + 75;
    prev = min;
    return { min, exact: !!explicit };
  });
}
