// Almacén de archivos (fotos, QR, PDFs) en IndexedDB: localStorage no aguanta binarios.

import { TRIP } from "./data/trip";
import type { FileRef } from "./types";

const DB_NAME = TRIP.id;
const STORE = "files";

let dbPromise: Promise<IDBDatabase> | undefined;

function db(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const req = fn(d.transaction(STORE, mode).objectStore(STORE));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
      }),
  );
}

export function newId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function putFile(blob: Blob): Promise<string> {
  const id = newId();
  await run("readwrite", (s) => s.put(blob, id));
  return id;
}

export function getFile(id: string): Promise<Blob | undefined> {
  return run<Blob | undefined>("readonly", (s) => s.get(id));
}

export function deleteFile(id: string): Promise<void> {
  return run<void>("readwrite", (s) => s.delete(id));
}

/** Reduce fotos grandes a JPEG de ~1600 px para no llenar el móvil. */
export async function resizeImage(file: File, max = 1600): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((res) => canvas.toBlob((b) => res(b ?? file), "image/jpeg", 0.85));
  } catch {
    return file;
  }
}

/** Guarda los archivos elegidos (las fotos, reducidas) y devuelve sus referencias. */
export async function storeFiles(list: FileList | null): Promise<FileRef[]> {
  const out: FileRef[] = [];
  for (const file of Array.from(list ?? [])) {
    const blob = file.type.startsWith("image/") ? await resizeImage(file, 2000) : file;
    out.push({ id: await putFile(blob), name: file.name, type: blob.type || file.type });
  }
  return out;
}
