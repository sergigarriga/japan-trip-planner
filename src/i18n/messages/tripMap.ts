import { defineMessages } from "..";

export const m = defineMessages({
  es: { aria: "Mapa del viaje", day: (n: number, title: string) => `Día ${n}: ${title}` },
  ca: { aria: "Mapa del viatge", day: (n: number, title: string) => `Dia ${n}: ${title}` },
  en: { aria: "Trip map", day: (n: number, title: string) => `Day ${n}: ${title}` },
  fr: { aria: "Carte du voyage", day: (n: number, title: string) => `Jour ${n} : ${title}` },
});
