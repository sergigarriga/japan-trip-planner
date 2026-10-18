import { useEffect, useRef } from "react";
import L from "leaflet";
import { DAYS } from "../data/trip";
import { blockColorVar } from "../lib";
import { useTrip } from "../state";

type Props = { theme: string; onOpen: (n: number) => void };

/** Mapa real con la ruta del viaje, un punto por día y el color de cada bloque. */
export function TripMap({ theme, onOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const openRef = useRef(onOpen);
  const { days } = useTrip();

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

      pts.forEach(({ d, g }) => {
        const marker = L.marker([g.lat, g.lon], {
          icon: L.divIcon({
            className: "mapdot-wrap",
            html: `<span class="mapdot" style="--c:${color(d.block)}">${d.n}</span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
          keyboard: true,
          title: `Día ${d.n}: ${d.title}`,
        }).addTo(map);
        const label = document.createElement("span");
        label.textContent = `Día ${d.n}: ${d.title}`; // texto plano: el título es editable
        marker.bindTooltip(label, { direction: "top", offset: [0, -12] });
        marker.on("click", () => openRef.current(d.n));
      });

      map.fitBounds(L.latLngBounds(pts.map((p) => [p.g.lat, p.g.lon] as [number, number])), { padding: [24, 24] });
    });

    return () => {
      cancelAnimationFrame(frame);
      map.remove();
    };
  }, [theme, days]);

  return <div ref={ref} className="tripmap" role="application" aria-label="Mapa del viaje" />;
}
