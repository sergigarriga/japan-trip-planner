const PATHS = {
  flight: "M2 16l20-6-2-2-7 2-5-6H6l3 7-4 1-2-2H1l1 4z M3 21h18",
  train:
    "M6 3h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3z M3 10h18 M8 21l2-4 M16 21l-2-4 M7.5 13.5h.01 M16.5 13.5h.01",
  visit: "M3 7h18 M5 4h14 M6 7v14 M18 7v14 M6 11h12",
  food: "M4 11h16a8 8 0 01-16 0z M8 3v5 M12 2v6 M16 3v5 M9 21h6",
  shop: "M5 8h14l-1 13H6L5 8z M9 8V6a3 3 0 016 0v2",
  stay: "M3 20V8 M21 20v-6a3 3 0 00-3-3H10v9 M3 14h18 M6.5 11a1.5 1.5 0 100-.01",
  logistics: "M3 7l9-4 9 4v10l-9 4-9-4V7z M3 7l9 4 9-4 M12 11v10",
  night: "M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14",
  alert: "M12 3l10 18H2L12 3z M12 10v5 M12 18h.01",
  check: "M5 12l5 5 9-10",
  sun: "M12 8a4 4 0 100 8 4 4 0 000-8z M12 2v2 M12 20v2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M2 12h2 M20 12h2 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4",
  cloud: "M7 18h10a4 4 0 00.5-7.97A6 6 0 006.2 9.1 4.5 4.5 0 007 18z",
  rain: "M7 14h10a4 4 0 00.5-7.97A6 6 0 006.2 5.1 4.5 4.5 0 007 14z M8 17l-1 3 M12 17l-1 3 M16 17l-1 3",
  snow: "M7 14h10a4 4 0 00.5-7.97A6 6 0 006.2 5.1 4.5 4.5 0 007 14z M8 18h.01 M12 20h.01 M16 18h.01 M10 22h.01 M14 22h.01",
  fog: "M4 10h16 M3 14h18 M6 18h12 M7 6h10",
  storm: "M7 14h10a4 4 0 00.5-7.97A6 6 0 006.2 5.1 4.5 4.5 0 007 14z M13 14l-3 4h4l-3 4",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14z M21 21l-5-5",
  edit: "M4 20h4L19 9l-4-4L4 16v4z M13.5 6.5l4 4",
  calendar: "M4 6h16v15H4z M4 10h16 M8 3v5 M16 3v5",
  plus: "M12 5v14 M5 12h14",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 14h10l1-14 M10 11v6 M14 11v6",
  camera: "M4 8h3l2-3h6l2 3h3v12H4z M12 10.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z",
  ticket: "M3 7h18v3a2 2 0 000 4v3H3v-3a2 2 0 000-4V7z M14 7v10",
  wallet: "M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H3z M3 7l13-4v4 M16 13.5h.01",
  book: "M4 4h7a2 2 0 012 2v14a2 2 0 00-2-2H4z M20 4h-7a2 2 0 00-2 2v14a2 2 0 012-2h7z",
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  close: "M6 6l12 12 M18 6L6 18",
  share: "M12 3v12 M7 8l5-5 5 5 M5 13v7h14v-7",
  speak: "M4 9v6h4l5 4V5L8 9H4z M17 9a4 4 0 010 6 M19.5 6.5a8 8 0 010 11",
  copy: "M8 8h12v12H8z M4 16V4h12",
  swap: "M7 4L3 8l4 4 M3 8h14 M17 20l4-4-4-4 M21 16H7",
  phone: "M5 3h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A18 18 0 013 5a2 2 0 012-2z",
  file: "M6 3h8l5 5v13H6z M14 3v5h5",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18z M12 7v5l3 2",
  undo: "M9 14L4 9l5-5 M4 9h10a6 6 0 010 12h-3",
  globe:
    "M12 3a9 9 0 100 18 9 9 0 000-18z M3 12h18 M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9 M12 3C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
