import { defineMessages } from "..";

export const m = defineMessages({
  es: {
    day: (n: number) => `Día ${n}`,
    prev: (name: string) => `Día anterior: ${name}`,
    noPrev: "Sin día anterior",
    next: (name: string) => `Día siguiente: ${name}`,
    noNext: "Sin día siguiente",
  },
  ca: {
    day: (n: number) => `Dia ${n}`,
    prev: (name: string) => `Dia anterior: ${name}`,
    noPrev: "No hi ha dia anterior",
    next: (name: string) => `Dia següent: ${name}`,
    noNext: "No hi ha dia següent",
  },
  en: {
    day: (n: number) => `Day ${n}`,
    prev: (name: string) => `Previous day: ${name}`,
    noPrev: "No previous day",
    next: (name: string) => `Next day: ${name}`,
    noNext: "No next day",
  },
  fr: {
    day: (n: number) => `Jour ${n}`,
    prev: (name: string) => `Jour précédent : ${name}`,
    noPrev: "Pas de jour précédent",
    next: (name: string) => `Jour suivant : ${name}`,
    noNext: "Pas de jour suivant",
  },
});
