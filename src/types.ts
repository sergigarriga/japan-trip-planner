// Modelo de datos del viaje. Los datos concretos viven en `src/data/trip.ts`.

import type { Lang } from "./i18n/langs";

/** Precio orientativo por persona. */
export type Price = {
  yen?: number;
  /** extremo superior cuando el precio es un rango */
  yenMax?: number;
  free?: boolean;
  note?: string;
};

export type StopKind = "flight" | "train" | "visit" | "food" | "shop" | "stay" | "logistics" | "night";

export type Stop = {
  /** "HH:MM" o una franja ("Mañana", "Tarde", "Noche"…) */
  time: string;
  /** hora de inicio "HH:MM" cuando `time` es una franja; si falta se deduce */
  start?: string;
  title: string;
  detail?: string;
  kind: StopKind;
  prices?: Price[];
  /** búsqueda para Google Maps */
  place?: string;
};

/** Escena ilustrada de la cabecera de cada día. */
export type Scene =
  | "plane"
  | "city"
  | "sea"
  | "fuji"
  | "lantern"
  | "pagoda"
  | "torii"
  | "bamboo"
  | "castle"
  | "roof"
  | "miyajima"
  | "alps"
  | "gassho"
  | "shop"
  | "lights"
  | "tower";

export type Geo = {
  lat: number;
  lon: number;
  scene: Scene;
  /** máxima y mínima media del mes del viaje, °C */
  climate: [number, number];
  label: string;
  /** fuera de Japón (no se dibuja en los mapas) */
  abroad?: boolean;
};

/** Tramo del viaje con color propio (estilo línea de tren); el color sale de la paleta del tema por orden. */
export type Block = {
  id: string;
  /** código corto, como la numeración de estaciones JR */
  code: string;
  name: string;
  subtitle: string;
};

export type Day = {
  n: number;
  /** YYYY-MM-DD */
  date: string;
  block: Block["id"];
  kanji: string;
  kana: string;
  romaji: string;
  title: string;
  /** dónde se duerme */
  base: string;
  geo: Geo;
  stops: Stop[];
  /** lugares en orden para la ruta de Google Maps */
  route: string[];
  tips: string[];
  warning?: string;
  /** reservas que conviene guardar ese día (sugerencias en la pestaña Reservas) */
  bookings?: string[];
};

export type Airport = { code: string; city: string; time: string };

export type Flight = {
  label: string;
  /** fecha de salida */
  date: string;
  from: Airport;
  /** aeropuerto de escala */
  via?: string;
  /** con la fecha de llegada, que puede ser el día siguiente */
  to: Airport & { date: string };
  airline: string;
};

export type Stay = { city: string; kanji: string; from: string; nights: number; block: Block["id"] };

export type ExpenseCat = "stay" | "transport" | "food" | "tickets" | "shopping" | "other";

export type BudgetLine = { concept: string; eur: number; cat: ExpenseCat; detail: string };

export type Note = { title: string; body: string };

export type Task = {
  id: string;
  label: string;
  /** fecha límite YYYY-MM-DD */
  due?: string;
  hint?: string;
  /** ya hecha por defecto */
  done?: boolean;
};

export type Welcome = { title: string; text: string; wish?: string; sign?: string; button: string };

export type TripConfig = {
  /** identificador corto: prefijo del almacenamiento local y del calendario */
  id: string;
  /** idioma en el que están escritos los textos de este archivo (las traducciones van en src/i18n/content/) */
  lang: Lang;
  title: string;
  /** título corto en japonés para la barra superior */
  titleJa: string;
  /** exactamente dos: los gastos compartidos se reparten a medias */
  travellers: [string, string];
  start: string;
  end: string;
  /** ciudad de origen, para el reloj doble y el calendario */
  home: { code: string; city: string; timeZone: string };
  yenPerEur: number;
  pace: string;
  luggage: string;
  /** mensaje del primer arranque; si falta no se muestra */
  welcome?: Welcome;
};

/** Archivo guardado en IndexedDB (fotos, QR, PDFs). */
export type FileRef = { id: string; name: string; type: string };
