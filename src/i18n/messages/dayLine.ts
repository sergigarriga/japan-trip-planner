import { defineMessages } from "..";

export const m = defineMessages({
  es: { nav: "Días del viaje", today: "Hoy", day: (n: number) => `Día ${n}` },
  ca: { nav: "Dies del viatge", today: "Avui", day: (n: number) => `Dia ${n}` },
  en: { nav: "Trip days", today: "Today", day: (n: number) => `Day ${n}` },
  fr: { nav: "Jours du voyage", today: "Aujourd’hui", day: (n: number) => `Jour ${n}` },
});
