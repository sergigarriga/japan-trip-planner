import { useCallback, useMemo } from "react";
import { DAYS } from "../data/trip";
import { deleteFile, newId } from "../db";
import { useStored } from "../hooks";
import { buzz } from "../lib";
import type { FileRef } from "../types";
import { TripContext, type TripState } from "./context";
import { BASE, type DayContent, type Expense, type PlanDay, type Reservation, type StayInfo } from "./model";

/** Estado del viaje: plan editado, paradas hechas, gastos, notas, fotos y reservas (todo en el navegador). */
export function TripProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useStored<(DayContent | null)[]>("plan:v1", []);
  const [done, setDone] = useStored<Record<string, boolean>>("done:v2", {});
  const [expenses, setExpenses] = useStored<Expense[]>("expenses", []);
  const [notes, setNotes] = useStored<Record<string, string>>("notes", {});
  const [photos, setPhotos] = useStored<Record<string, FileRef[]>>("photos", {});
  const [covers, setCovers] = useStored<Record<string, string>>("covers", {});
  const [reservations, setReservations] = useStored<Reservation[]>("reservations", []);
  const [stays, setStays] = useStored<Record<number, StayInfo>>("stays", {});

  const days = useMemo<PlanDay[]>(
    () =>
      DAYS.map((d, i) => ({
        n: d.n,
        date: d.date,
        block: d.block,
        ...(plan[i] ?? BASE[i]),
      })),
    [plan],
  );

  const contentAt = useCallback((p: (DayContent | null)[], i: number) => p[i] ?? BASE[i], []);

  const saveDay = useCallback(
    (n: number, content: DayContent) =>
      setPlan((p) => {
        const next = DAYS.map((_, i) => p[i] ?? null);
        next[n] = content;
        return next;
      }),
    [setPlan],
  );

  const swapDays = useCallback(
    (a: number, b: number) =>
      setPlan((p) => {
        const next = DAYS.map((_, i) => p[i] ?? null);
        const ca = contentAt(p, a);
        next[a] = contentAt(p, b);
        next[b] = ca;
        return next;
      }),
    [setPlan, contentAt],
  );

  const resetDay = useCallback(
    (n: number) =>
      setPlan((p) => {
        const next = DAYS.map((_, i) => p[i] ?? null);
        next[n] = null;
        return next;
      }),
    [setPlan],
  );

  const value: TripState = {
    days,
    edited: DAYS.map((_, i) => plan[i] != null),
    saveDay,
    swapDays,
    resetDay,

    done,
    toggleDone: (id) => {
      buzz();
      setDone((s) => ({ ...s, [id]: !s[id] }));
    },

    expenses,
    addExpense: (e) => {
      buzz();
      setExpenses((xs) => [...xs, { ...e, id: newId() }]);
    },
    removeExpense: (id) => setExpenses((xs) => xs.filter((x) => x.id !== id)),

    notes,
    setNote: (date, text) => setNotes((s) => ({ ...s, [date]: text })),

    photos,
    addPhoto: (date, file) => setPhotos((s) => ({ ...s, [date]: [...(s[date] ?? []), file] })),
    removePhoto: (date, id) => {
      deleteFile(id).catch(() => undefined);
      setPhotos((s) => ({ ...s, [date]: (s[date] ?? []).filter((f) => f.id !== id) }));
      setCovers((c) => {
        if (c[date] !== id) return c;
        const next = { ...c };
        delete next[date];
        return next;
      });
    },
    covers,
    setCover: (date, id) =>
      setCovers((c) => {
        const next = { ...c };
        if (id) next[date] = id;
        else delete next[date];
        return next;
      }),

    reservations,
    saveReservation: (r) =>
      setReservations((xs) => (xs.some((x) => x.id === r.id) ? xs.map((x) => (x.id === r.id ? r : x)) : [...xs, r])),
    removeReservation: (id) =>
      setReservations((xs) => {
        xs.find((x) => x.id === id)?.files.forEach((f) => deleteFile(f.id).catch(() => undefined));
        return xs.filter((x) => x.id !== id);
      }),

    stays,
    setStay: (i, info) => setStays((s) => ({ ...s, [i]: info })),
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}
