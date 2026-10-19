import { useEffect, useRef } from "react";
import L from "leaflet";
import { DAYS } from "../data/trip";
import { msg, tc, useLang } from "../i18n";
import { m } from "../i18n/messages/tripMap";
import { blockColorVar } from "../lib";
import { useTrip } from "../state";

type Props = { theme: string; onOpen: (n: number) => void };

/** Mapa real con la ruta del viaje, un punto por día y el color de cada bloque. */
export function TripMap({ theme, onOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const openRef = useRef(onOpen);
  const { days } = useTrip();
  const lang = useLang();

  useEffect(() => {
    openRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.5 });
    let frame = 0;

    // Esperamos un frame para que el tema ya esté aplicado al leer los colores CSS.
    frame = requestAnimationFrame(() => {
      const css = getComputedStyle(document.documentElement);
      const color = (block: string) => css.getPropertyValue(blockColorVar(block)).trim() || "#e5487a";
      // Mapas de OpenStreetMap (sin clave); en el tema Neón se oscurecen por CSS.
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
        className: "tripmap__tiles",
      }).addTo(map);

      const pts = days.map((d) => ({ d, g: DAYS[d.origin].geo })).filter(({ g }) => !g.abroad);

      for (let i = 1; i < pts.length; i++) {
        L.polyline(
          [
            [pts[i - 1].g.lat, pts[i - 1].g.lon],
            [pts[i].g.lat, pts[i].g.lon],
          ],
          { color: color(pts[i].d.block), weight: 4, opacity: 0.85, lineCap: "round" },
        ).addTo(map);
      }

      // Los días del mismo lugar (p. ej. varios en Tokio) se abren en círculo para que no se tapen.
      const NEAR = 0.9; // grados (~90 km): más cerca que esto cuenta como el mismo lugar
      const clusters: { lat: number; lon: number; days: number[] }[] = [];
      for (const { d, g } of pts) {
        const near = clusters.find((c) => Math.hypot(c.lat - g.lat, c.lon - g.lon) < NEAR);
        if (near) near.days.push(d.n);
        else clusters.push({ lat: g.lat, lon: g.lon, days: [d.n] });
      }
      const groupOf = (n: number) => clusters.find((c) => c.days.includes(n))?.days ?? [n];

      pts.forEach(({ d, g }) => {
        const dayLabel = m[lang].day(d.n, tc(d.title));
        const group = groupOf(d.n);
        const slot = group.indexOf(d.n);
        const radius = group.length > 1 ? Math.max(20, (group.length * 34) / (2 * Math.PI)) : 0;
        const angle = (2 * Math.PI * slot) / group.length - Math.PI / 2;
        const dx = Math.cos(angle) * radius;
        const dy = Math.sin(angle) * radius;
        const marker = L.marker([g.lat, g.lon], {
          icon: L.divIcon({
            className: "mapdot-wrap",
            html: `<span class="mapdot" style="--c:${color(d.block)}">${d.n}</span>`,
            iconSize: [26, 26],
            iconAnchor: [13 - dx, 13 - dy],
          }),
          keyboard: true,
          title: dayLabel,
        }).addTo(map);
        const label = document.createElement("span");
        label.textContent = dayLabel; // texto plano: el título es editable
        marker.bindTooltip(label, { direction: "top", offset: [0, -12] });
        marker.on("click", () => openRef.current(d.n));
      });

      map.fitBounds(L.latLngBounds(pts.map((p) => [p.g.lat, p.g.lon] as [number, number])), { padding: [24, 24] });
    });

    return () => {
      cancelAnimationFrame(frame);
      map.remove();
    };
  }, [theme, days, lang]);

  return <div ref={ref} className="tripmap" role="application" aria-label={msg(m).aria} />;
}
