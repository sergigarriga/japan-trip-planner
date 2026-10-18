import { defineMessages } from "..";

/** "de novembre" / "d’octubre" (elisión ante vocal en catalán y francés). */
const elide = (month: string) => (/^[aeiouàâéèêíïòóôúh]/i.test(month) ? `d’${month}` : `de ${month}`);

export const m = defineMessages({
  es: {
    monthAvg: "Media del mes",
    clear: "Despejado",
    partly: "Nubes y claros",
    fog: "Niebla",
    rain: "Lluvia",
    snow: "Nieve",
    storm: "Tormenta",
    avgOf: (month: string) => `Media de ${month}`,
    rainPct: (pct: number) => `, lluvia ${pct}%`,
    coat: ", abrigo",
  },
  ca: {
    monthAvg: "Mitjana del mes",
    clear: "Serè",
    partly: "Núvols i clarianes",
    fog: "Boira",
    rain: "Pluja",
    snow: "Neu",
    storm: "Tempesta",
    avgOf: (month: string) => `Mitjana ${elide(month)}`,
    rainPct: (pct: number) => `, pluja ${pct}%`,
    coat: ", abric",
  },
  en: {
    monthAvg: "Monthly average",
    clear: "Clear",
    partly: "Partly cloudy",
    fog: "Fog",
    rain: "Rain",
    snow: "Snow",
    storm: "Storm",
    avgOf: (month: string) => `${month} average`,
    rainPct: (pct: number) => `, rain ${pct}%`,
    coat: ", bring a coat",
  },
  fr: {
    monthAvg: "Moyenne du mois",
    clear: "Dégagé",
    partly: "Éclaircies",
    fog: "Brouillard",
    rain: "Pluie",
    snow: "Neige",
    storm: "Orage",
    avgOf: (month: string) => `Moyenne ${elide(month)}`,
    rainPct: (pct: number) => `, pluie ${pct} %`,
    coat: ", manteau",
  },
});
