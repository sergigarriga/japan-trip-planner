import { TRIP } from "../data/trip";

/** Clave de localStorage con el prefijo del viaje, para no mezclar datos entre guías. */
export function storageKey(name: string): string {
  return `${TRIP.id}:${name}`;
}

export function readStored<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(name));
    return raw == null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored(name: string, value: unknown): void {
  try {
    localStorage.setItem(storageKey(name), JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible o lleno */
  }
}

export function downloadFile(name: string, content: string | Blob, type = "text/calendar") {
  const blob = typeof content === "string" ? new Blob([content], { type }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Vibración corta al confirmar (solo Android; iOS Safari la ignora). */
export function buzz(ms = 12) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* sin vibración */
  }
}

/** Lee un texto en japonés con la voz del sistema. */
export function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  speechSynthesis.speak(u);
}
