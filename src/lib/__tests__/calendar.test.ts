import { beforeEach, describe, expect, it } from "vitest";
import { setLang } from "../../i18n";
import { buildIcs, slug } from "../calendar";

describe("calendar", () => {
  beforeEach(() => setLang("es"));

  it("genera eventos en UTC a partir de la hora de Japón", () => {
    const ics = buildIcs(
      [{ date: "2027-11-25", stops: [{ title: "teamLab; Planets", time: "11:30", place: "Toyosu, Tokio" }] }],
      undefined,
      new Date("2027-01-01T00:00:00Z"),
    );
    expect(ics).toContain("DTSTART:20271125T023000Z");
    expect(ics).toContain("DTEND:20271125T033000Z");
    expect(ics).toContain("SUMMARY:teamLab\\; Planets");
    expect(ics).toContain("LOCATION:Toyosu\\, Tokio");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });

  it("crea nombres de archivo sin acentos ni espacios", () => {
    expect(slug("Japón 2027")).toBe("japon-2027");
  });
});
