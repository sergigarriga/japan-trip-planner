import { describe, expect, it } from "vitest";
import { addDays, daysBetween, longDate, monthName, shortDate, weekdayIndex, zonedTime } from "../dates";

describe("dates", () => {
  it("formatea fechas en español sin desfase de zona horaria", () => {
    expect(shortDate("2027-11-21")).toBe("21 nov");
    expect(longDate("2027-11-21")).toBe("Domingo 21 de noviembre");
    expect(monthName("2027-01-05")).toBe("enero");
  });

  it("suma días y cuenta la distancia entre fechas, cruzando meses", () => {
    expect(addDays("2027-10-30", 3)).toBe("2027-11-02");
    expect(daysBetween("2027-11-10", "2027-11-29")).toBe(19);
  });

  it("numera la semana de lunes (0) a domingo (6)", () => {
    expect(weekdayIndex("2027-11-15")).toBe(0);
    expect(weekdayIndex("2027-11-21")).toBe(6);
  });

  it("convierte una hora local de otra zona a UTC, también tras el cambio de hora", () => {
    // Madrid en invierno es UTC+1 y en verano UTC+2
    expect(new Date(zonedTime("2027-11-10", "11:05", "Europe/Madrid")).toISOString()).toBe("2027-11-10T10:05:00.000Z");
    expect(new Date(zonedTime("2027-07-01", "09:00", "Europe/Madrid")).toISOString()).toBe("2027-07-01T07:00:00.000Z");
    expect(new Date(zonedTime("2027-11-11", "18:10", "Asia/Tokyo")).toISOString()).toBe("2027-11-11T09:10:00.000Z");
  });
});
