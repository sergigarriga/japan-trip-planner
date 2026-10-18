import { useEffect, useState } from "react";
import { getFile } from "./db";
import { readStored, writeStored } from "./lib/browser";

/** Estado persistido en localStorage con el prefijo del viaje (tolera navegadores sin almacenamiento). */
export function useStored<T>(name: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStored(name, initial));

  useEffect(() => writeStored(name, value), [name, value]);

  return [value, setValue] as const;
}

export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Mantiene la pantalla encendida mientras `on` sea true (Screen Wake Lock API). */
export function useWakeLock(on: boolean): boolean {
  const supported = typeof navigator !== "undefined" && "wakeLock" in navigator;

  useEffect(() => {
    if (!on || !supported) return;
    let sentinel: WakeLockSentinel | undefined;
    const acquire = async () => {
      try {
        sentinel = await navigator.wakeLock.request("screen");
      } catch {
        /* denegado (batería baja, pestaña oculta…) */
      }
    };
    const onVisible = () => document.visibilityState === "visible" && acquire();
    acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      sentinel?.release();
    };
  }, [on, supported]);

  return supported;
}

/** URL temporal para un archivo guardado en IndexedDB. */
export function useFileUrl(id?: string): string | undefined {
  const [loaded, setLoaded] = useState<{ id: string; url: string }>();

  useEffect(() => {
    if (!id) return;
    let alive = true;
    let created: string | undefined;
    getFile(id)
      .then((blob) => {
        if (!blob || !alive) return;
        created = URL.createObjectURL(blob);
        setLoaded({ id, url: created });
      })
      .catch(() => undefined);
    return () => {
      alive = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [id]);

  return id && loaded?.id === id ? loaded.url : undefined;
}
