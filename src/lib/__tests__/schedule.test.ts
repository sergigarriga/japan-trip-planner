import { beforeEach, describe, expect, it } from "vitest";
import { setLang } from "../../i18n";
import { fmtMin, stopStarts, toMin } from "../schedule";

describe("schedule", () => {
  beforeEach(() => setLang("es"));

  it("convierte entre HH:MM y minutos", () => {
    expect(toMin("07:30")).toBe(450);
    expect(fmtMin(450)).toBe("07:30");
    expect(fmtMin(25 * 60)).toBe("01:00");
  });

  it("usa la hora exacta cuando la hay", () => {
    expect(stopStarts([{ time: "11:30" }])).toEqual([{ min: 690, exact: true }]);
    expect(stopStarts([{ time: "Mañana", start: "08:15" }])).toEqual([{ min: 495, exact: true }]);
  });

  it("reparte las franjas repetidas sin que se solapen", () => {
    const starts = stopStarts([{ time: "Mañana" }, { time: "Mañana" }, { time: "Tarde" }]);
    expect(starts.map((s) => s.min)).toEqual([540, 615, 930]);
    expect(starts.every((s) => !s.exact)).toBe(true);
  });
});
