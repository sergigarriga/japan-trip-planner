import { defineMessages } from "..";

export const m = defineMessages({
  es: {
    title: "Cuenta atrás",
    days: "días",
    hours: "horas",
    mins: "min",
    secs: "seg",
    foot: (date: string, time: string, city: string) =>
      `Despegue el ${date.toLowerCase()} a las ${time} desde ${city}.`,
  },
  ca: {
    title: "Compte enrere",
    days: "dies",
    hours: "hores",
    mins: "min",
    secs: "s",
    foot: (date: string, time: string, city: string) =>
      `Enlairament el ${date.toLowerCase()} a les ${time} des de ${city}.`,
  },
  en: {
    title: "Countdown",
    days: "days",
    hours: "hours",
    mins: "min",
    secs: "sec",
    foot: (date: string, time: string, city: string) => `Take-off on ${date} at ${time} from ${city}.`,
  },
  fr: {
    title: "Compte à rebours",
    days: "jours",
    hours: "heures",
    mins: "min",
    secs: "s",
    foot: (date: string, time: string, city: string) => `Décollage le ${date.toLowerCase()} à ${time} depuis ${city}.`,
  },
});
