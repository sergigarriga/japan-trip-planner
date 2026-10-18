import { DAYS } from "../data/trip";
import { msg, tc } from "../i18n";
import { m } from "../i18n/messages/japanMap";
import { useTrip } from "../state";

// Contornos muy simplificados (lon, lat) de las cuatro islas principales.
const ISLANDS: [number, number][][] = [
  // Honshu
  [
    [130.9, 33.95],
    [131.4, 34.4],
    [132.2, 35.0],
    [133.0, 35.55],
    [134.2, 35.6],
    [135.2, 35.75],
    [135.9, 35.75],
    [136.1, 36.3],
    [136.7, 37.1],
    [136.9, 37.5],
    [137.3, 37.5],
    [137.3, 36.8],
    [138.2, 37.1],
    [138.8, 37.8],
    [139.4, 38.2],
    [139.8, 39.0],
    [140.0, 39.8],
    [139.9, 40.6],
    [140.3, 41.2],
    [140.9, 41.5],
    [141.4, 41.4],
    [141.5, 40.6],
    [141.9, 40.0],
    [142.0, 39.5],
    [141.6, 38.4],
    [141.0, 38.3],
    [141.0, 37.2],
    [140.8, 36.8],
    [140.6, 36.3],
    [140.9, 35.7],
    [140.4, 35.1],
    [139.9, 34.9],
    [139.8, 35.3],
    [139.6, 35.3],
    [139.2, 35.2],
    [138.9, 34.7],
    [138.8, 35.0],
    [138.3, 34.6],
    [137.3, 34.7],
    [137.0, 34.6],
    [136.9, 35.0],
    [136.6, 34.6],
    [136.9, 34.3],
    [136.3, 34.2],
    [135.8, 33.5],
    [135.1, 33.9],
    [135.4, 34.6],
    [134.8, 34.7],
    [134.0, 34.6],
    [133.2, 34.3],
    [132.5, 34.3],
    [131.9, 33.95],
    [131.0, 33.9],
  ],
  // Kyushu
  [
    [130.9, 33.9],
    [131.6, 33.6],
    [131.9, 33.0],
    [131.6, 32.3],
    [131.3, 31.4],
    [130.7, 31.0],
    [130.2, 31.3],
    [130.3, 32.1],
    [130.1, 32.7],
    [129.6, 33.2],
    [129.8, 33.5],
    [130.4, 33.6],
  ],
  // Shikoku
  [
    [132.4, 33.3],
    [132.9, 34.0],
    [133.6, 34.3],
    [134.3, 34.2],
    [134.7, 33.8],
    [134.2, 33.3],
    [133.6, 33.4],
    [133.0, 32.8],
    [132.5, 32.9],
  ],
  // Hokkaido
  [
    [140.0, 41.4],
    [140.4, 42.0],
    [140.0, 42.6],
    [140.5, 43.2],
    [141.4, 43.2],
    [141.7, 44.3],
    [141.9, 45.4],
    [142.8, 44.7],
    [144.3, 44.1],
    [145.3, 44.3],
    [145.2, 43.6],
    [145.8, 43.4],
    [144.8, 42.9],
    [143.3, 42.0],
    [141.8, 42.6],
    [141.0, 42.3],
    [141.2, 41.8],
    [140.6, 41.7],
  ],
];

const LON0 = 129.2;
const LAT0 = 45.8;
const K = 22;
const px = (lon: number, lat: number): [number, number] => [(lon - LON0) * K, (LAT0 - lat) * K * 1.22];

const LABELS = [
  { name: "Tokio", lon: 139.75, lat: 35.68, dx: 10, dy: 16 },
  { name: "Kioto", lon: 135.77, lat: 35.01, dx: -12, dy: -12 },
  { name: "Hiroshima", lon: 132.4, lat: 34.35, dx: -20, dy: 20 },
  { name: "Takayama", lon: 137.1, lat: 36.2, dx: -40, dy: -14 },
];

type Props = { progress: number; animate?: boolean };

/** Mapa ilustrado de Japón: la ruta se ilumina según los días vividos. */
export function JapanMap({ progress, animate }: Props) {
  const { days } = useTrip();
  const t = msg(m);
  const pts = days
    .map((d) => ({ d, geo: DAYS[d.origin].geo }))
    .filter(({ geo }) => !geo.abroad)
    .map(({ d, geo }) => ({ d, xy: px(geo.lon, geo.lat) }));
  const [w, h] = px(146.2, 30.8);

  return (
    <svg className={`jmap${animate ? " jmap--animate" : ""}`} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={t.aria}>
      {ISLANDS.map((isl, i) => (
        <polygon key={i} className="jmap__land" points={isl.map(([lon, lat]) => px(lon, lat).join(",")).join(" ")} />
      ))}
      {pts.slice(1).map(({ d, xy }, i) => {
        const [x1, y1] = pts[i].xy;
        return (
          <line
            key={d.n}
            data-block={d.block}
            className={`jmap__seg${d.n <= progress ? " is-lit" : ""}`}
            x1={x1}
            y1={y1}
            x2={xy[0]}
            y2={xy[1]}
            style={{ "--i": i } as React.CSSProperties}
          />
        );
      })}
      {pts.map(({ d, xy }) => (
        <circle
          key={d.n}
          data-block={d.block}
          className={`jmap__dot${d.n <= progress ? " is-lit" : ""}${d.n === progress ? " is-now" : ""}`}
          cx={xy[0]}
          cy={xy[1]}
          r={d.n === progress ? 5.5 : 3.5}
        />
      ))}
      {LABELS.map((l) => {
        const [x, y] = px(l.lon, l.lat);
        return (
          <text key={l.name} className="jmap__label" x={x + l.dx} y={y + l.dy}>
            {tc(l.name)}
          </text>
        );
      })}
    </svg>
  );
}
