import { describe, expect, it } from "vitest";
import { addDays, daysBetween } from "../../lib/dates";
import { BLOCKS, BUDGET, DAYS, FLIGHTS, STAYS, TASKS, TRIP } from "../trip";

// Comprueba que los datos del viaje son coherentes: útil al personalizar `trip.ts`.
describe("datos del viaje", () => {
  const iso = /^\d{4}-\d{2}-\d{2}$/;

  it("numera los días de forma consecutiva y con fechas seguidas", () => {
    DAYS.forEach((d, i) => {
      expect(d.n).toBe(i);
      expect(d.date).toMatch(iso);
      if (i > 0) expect(daysBetween(DAYS[i - 1].date, d.date)).toBe(1);
    });
    expect(DAYS[0].date).toBe(TRIP.start);
  });

  it("asigna cada día y cada estancia a un bloque existente", () => {
    const ids = new Set(BLOCKS.map((b) => b.id));
    for (const d of DAYS) expect(ids.has(d.block)).toBe(true);
    for (const s of STAYS) expect(ids.has(s.block)).toBe(true);
  });

  it("encadena las estancias sin huecos ni solapes", () => {
    STAYS.slice(1).forEach((s, i) => expect(s.from).toBe(addDays(STAYS[i].from, STAYS[i].nights)));
  });

  it("tiene coordenadas válidas y horas bien escritas", () => {
    for (const d of DAYS) {
      expect(Math.abs(d.geo.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(d.geo.lon)).toBeLessThanOrEqual(180);
      for (const s of d.stops) if (s.start) expect(s.start).toMatch(/^\d{1,2}:\d{2}$/);
    }
  });

  it("usa identificadores de tarea únicos y fechas válidas", () => {
    expect(new Set(TASKS.map((t) => t.id)).size).toBe(TASKS.length);
    for (const t of TASKS) if (t.due) expect(t.due).toMatch(iso);
  });

  it("tiene vuelos, presupuesto y una zona horaria de origen válida", () => {
    expect(FLIGHTS.length).toBeGreaterThan(0);
    expect(BUDGET.every((b) => b.eur >= 0)).toBe(true);
    expect(() => new Intl.DateTimeFormat("es-ES", { timeZone: TRIP.home.timeZone })).not.toThrow();
  });
});
