import { createContext, useContext } from "react";
import type { DayContent, Expense, PlanDay, Reservation, StayInfo } from "./model";
import type { FileRef } from "../types";

export type TripState = {
  days: PlanDay[];
  edited: boolean[];
  saveDay: (n: number, content: DayContent) => void;
  swapDays: (a: number, b: number) => void;
  resetDay: (n: number) => void;

  done: Record<string, boolean>;
  toggleDone: (stopId: string) => void;

  expenses: Expense[];
  addExpense: (e: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;

  notes: Record<string, string>;
  setNote: (date: string, text: string) => void;

  photos: Record<string, FileRef[]>;
  addPhoto: (date: string, file: FileRef) => void;
  removePhoto: (date: string, id: string) => void;
  covers: Record<string, string>;
  setCover: (date: string, id: string | null) => void;

  reservations: Reservation[];
  saveReservation: (r: Reservation) => void;
  removeReservation: (id: string) => void;

  stays: Record<number, StayInfo>;
  setStay: (i: number, info: StayInfo) => void;
};

export const TripContext = createContext<TripState | null>(null);

export function useTrip(): TripState {
  const v = useContext(TripContext);
  if (!v) throw new Error("useTrip fuera de TripProvider");
  return v;
}
