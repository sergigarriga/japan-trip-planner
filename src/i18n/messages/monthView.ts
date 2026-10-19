import { defineMessages } from "..";

/** `zeroIsSingular`: el francés usa el singular con 0 y con 1 ("0 jour"). */
const plural =
  (one: string, many: string, zeroIsSingular = false) =>
  (n: number) =>
    `${n} ${n === 1 || (zeroIsSingular && n === 0) ? one : many}`;

const es = { nights: plural("noche", "noches"), days: plural("día", "días") };
const ca = { nights: plural("nit", "nits"), days: plural("dia", "dies") };
const en = { nights: plural("night", "nights"), days: plural("day", "days") };
const fr = { nights: plural("nuit", "nuits", true), days: plural("jour", "jours", true) };

export const m = defineMessages({
  es: {
    markerFlight: "Vuelo",
    markerTrain: "Tren largo",
    markerLogistics: "Maletas",
    markerAlert: "Por revisar",
    /** Iniciales de lunes a domingo, separadas por espacios. */
    week: "L M X J V S D",
    summary: (days: number, nights: number) => `${es.days(days)} en Japón, ${es.nights(nights)}`,
    calendar: "Calendario del viaje",
    peekDate: (n: number, date: string) => `Día ${n}, ${date.toLowerCase()}`,
    sleepIn: "Dormís en",
    stops: "Paradas",
    spend: "Gasto",
    more: (n: number) => `y ${n} más`,
    warning: "Este día tiene un aviso por revisar.",
    open: (n: number) => `Abrir día ${n}`,
    mapTitle: "Mapa del viaje",
    mapHint: "Toca un punto para abrir ese día.",
    staysTitle: "Dónde dormís",
    staysSummary: (nights: number, from: string, to: string) => `${es.nights(nights)}, del ${from} al ${to}`,
    nights: es.nights,
    stayBar: (city: string, nights: number) => `${city}: ${es.nights(nights)}`,
  },
  ca: {
    markerFlight: "Vol",
    markerTrain: "Tren llarg",
    markerLogistics: "Maletes",
    markerAlert: "Per revisar",
    week: "Dl Dt Dc Dj Dv Ds Dg",
    summary: (days: number, nights: number) => `${ca.days(days)} al Japó, ${ca.nights(nights)}`,
    calendar: "Calendari del viatge",
    peekDate: (n: number, date: string) => `Dia ${n}, ${date.toLowerCase()}`,
    sleepIn: "Dormiu a",
    stops: "Parades",
    spend: "Despesa",
    more: (n: number) => `i ${n} més`,
    warning: "Aquest dia té un avís per revisar.",
    open: (n: number) => `Obre el dia ${n}`,
    mapTitle: "Mapa del viatge",
    mapHint: "Toca un punt per obrir aquell dia.",
    staysTitle: "On dormiu",
    staysSummary: (nights: number, from: string, to: string) => `${ca.nights(nights)}, del ${from} al ${to}`,
    nights: ca.nights,
    stayBar: (city: string, nights: number) => `${city}: ${ca.nights(nights)}`,
  },
  en: {
    markerFlight: "Flight",
    markerTrain: "Long train ride",
    markerLogistics: "Luggage",
    markerAlert: "To check",
    week: "M T W T F S S",
    summary: (days: number, nights: number) => `${en.days(days)} in Japan, ${en.nights(nights)}`,
    calendar: "Trip calendar",
    peekDate: (n: number, date: string) => `Day ${n}, ${date}`,
    sleepIn: "Staying in",
    stops: "Stops",
    spend: "Spending",
    more: (n: number) => `and ${n} more`,
    warning: "This day has a warning to check.",
    open: (n: number) => `Open day ${n}`,
    mapTitle: "Trip map",
    mapHint: "Tap a dot to open that day.",
    staysTitle: "Where you’re staying",
    staysSummary: (nights: number, from: string, to: string) => `${en.nights(nights)}, from ${from} to ${to}`,
    nights: en.nights,
    stayBar: (city: string, nights: number) => `${city}: ${en.nights(nights)}`,
  },
  fr: {
    markerFlight: "Vol",
    markerTrain: "Long trajet en train",
    markerLogistics: "Bagages",
    markerAlert: "À vérifier",
    week: "L M M J V S D",
    summary: (days: number, nights: number) => `${fr.days(days)} au Japon, ${fr.nights(nights)}`,
    calendar: "Calendrier du voyage",
    peekDate: (n: number, date: string) => `Jour ${n}, ${date.toLowerCase()}`,
    sleepIn: "Vous dormez à",
    stops: "Étapes",
    spend: "Dépense",
    more: (n: number) => `et ${n} autres`,
    warning: "Ce jour comporte un avertissement à vérifier.",
    open: (n: number) => `Ouvrir le jour ${n}`,
    mapTitle: "Carte du voyage",
    mapHint: "Touchez un point pour ouvrir ce jour.",
    staysTitle: "Où vous dormez",
    staysSummary: (nights: number, from: string, to: string) => `${fr.nights(nights)}, du ${from} au ${to}`,
    nights: fr.nights,
    stayBar: (city: string, nights: number) => `${city}\u00a0: ${fr.nights(nights)}`,
  },
});
