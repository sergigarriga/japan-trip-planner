import { describe, expect, it } from "vitest";
import { dayTotal, priceLabel, yen } from "../money";

describe("money", () => {
  it("agrupa los miles con punto", () => {
    expect(yen(1200)).toBe("1.200 ¥");
    expect(yen(950)).toBe("950 ¥");
  });

  it("describe precios gratis, rangos y notas", () => {
    expect(priceLabel({ free: true }).main).toBe("Gratis");
    expect(priceLabel({ yen: 5000, yenMax: 8000 }).main).toBe("5.000–8.000 ¥");
    expect(priceLabel({ yen: 1600, note: "por persona" }).sub).toMatch(/por persona$/);
  });

  it("suma el gasto mínimo del día", () => {
    const total = dayTotal({
      stops: [
        { time: "Mañana", kind: "visit", title: "A", prices: [{ free: true }, { yen: 100 }] },
        { time: "Tarde", kind: "food", title: "B", prices: [{ yen: 5000, yenMax: 8000 }] },
        { time: "Noche", kind: "night", title: "C" },
      ],
    });
    expect(total).toBe(5100);
  });
});
