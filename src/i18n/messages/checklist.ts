import { defineMessages } from "..";

export const m = defineMessages({
  es: {
    overdue: (date: string) => `Venció el ${date}`,
    today: "Hoy",
    inDays: (n: number, date: string) => `En ${n} ${n === 1 ? "día" : "días"} · ${date}`,
    title: "Antes de salir",
    progress: (done: number, total: number) => `${done} de ${total} hechas`,
  },
  ca: {
    overdue: (date: string) => `Va vèncer el ${date}`,
    today: "Avui",
    inDays: (n: number, date: string) => `D’aquí a ${n} ${n === 1 ? "dia" : "dies"} · ${date}`,
    title: "Abans de marxar",
    progress: (done: number, total: number) => `${done} de ${total} fetes`,
  },
  en: {
    overdue: (date: string) => `Was due ${date}`,
    today: "Today",
    inDays: (n: number, date: string) => `In ${n} ${n === 1 ? "day" : "days"} · ${date}`,
    title: "Before you go",
    progress: (done: number, total: number) => `${done} of ${total} done`,
  },
  fr: {
    overdue: (date: string) => `En retard depuis le ${date}`,
    today: "Aujourd’hui",
    inDays: (n: number, date: string) => `Dans ${n} ${n === 1 ? "jour" : "jours"} · ${date}`,
    title: "Avant de partir",
    progress: (done: number, total: number) => `${done} sur ${total} faites`,
  },
});
