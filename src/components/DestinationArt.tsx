import type { Scene } from "../types";

const BASE = 116;

function Torii({ cx, s = 1 }: { cx: number; s?: number }) {
  const top = BASE - 92 * s;
  return (
    <g>
      <path d={`M${cx - 44 * s} ${top - 4 * s} Q${cx} ${top + 8 * s} ${cx + 44 * s} ${top - 4 * s}`} />
      <path d={`M${cx - 34 * s} ${top + 18 * s} H${cx + 34 * s}`} />
      <path d={`M${cx - 24 * s} ${top + 2 * s} V${BASE} M${cx + 24 * s} ${top + 2 * s} V${BASE}`} />
    </g>
  );
}

const waves = (y: number) => `M0 ${y} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`;

function SceneShapes({ scene }: { scene: Scene }) {
  switch (scene) {
    case "city":
      return (
        <g>
          {[
            [10, 62, 26],
            [40, 40, 22],
            [66, 72, 30],
            [100, 28, 18],
            [122, 56, 34],
            [160, 18, 20],
            [184, 64, 26],
            [214, 44, 24],
            [242, 74, 30],
            [276, 50, 22],
          ].map(([x, y, w]) => (
            <rect key={x} x={x} y={y} width={w} height={BASE - y} rx={2} />
          ))}
          <circle cx={300} cy={24} r={12} />
        </g>
      );
    case "sea":
      return (
        <g>
          <path d="M140 104 L196 38 H214 L270 104" />
          <circle cx={205} cy={28} r={6} />
          <circle cx={216} cy={17} r={8} />
          <circle cx={230} cy={9} r={5} />
          <path d={waves(104)} />
          <path d={waves(114)} />
        </g>
      );
    case "fuji":
      return (
        <g>
          <path d="M10 116 L146 28 Q160 20 174 28 L310 116" />
          <path d="M118 46 L132 56 L146 46 L160 58 L174 46 L188 56 L202 46" />
          <circle cx={62} cy={40} r={16} />
        </g>
      );
    case "lantern":
      return (
        <g>
          {[110, 220].map((cx) => (
            <g key={cx}>
              <path d={`M${cx} 0 V20`} />
              <rect x={cx - 11} y={20} width={22} height={7} rx={2} />
              <ellipse cx={cx} cy={58} rx={28} ry={32} />
              {[36, 48, 58, 68, 80].map((y, i) => {
                const w = [34, 50, 56, 50, 34][i] / 2;
                return <path key={y} d={`M${cx - w} ${y} H${cx + w}`} />;
              })}
              <rect x={cx - 11} y={89} width={22} height={7} rx={2} />
              <path d={`M${cx} 96 V114`} />
            </g>
          ))}
        </g>
      );
    case "pagoda":
      return (
        <g>
          {[0, 1, 2, 3, 4].map((i) => {
            const w = 128 - 20 * i;
            const y = 104 - 19 * i;
            return (
              <g key={i}>
                <path d={`M${160 - w / 2} ${y} Q160 ${y - 10} ${160 + w / 2} ${y}`} />
                <path d={`M${160 - w / 2 + 16} ${y + 1} V${y + 12} M${160 + w / 2 - 16} ${y + 1} V${y + 12}`} />
              </g>
            );
          })}
          <path d="M160 6 V26 M154 12 H166 M154 18 H166" />
        </g>
      );
    case "torii":
      return (
        <g>
          {[0, 1, 2, 3].map((k) => (
            <Torii key={k} cx={70 + k * 64} s={1 - k * 0.2} />
          ))}
        </g>
      );
    case "miyajima":
      return (
        <g>
          <Torii cx={150} s={0.95} />
          <circle cx={262} cy={34} r={14} />
          <path d={waves(106)} />
          <path d={waves(115)} />
        </g>
      );
    case "bamboo":
      return (
        <g>
          {[24, 58, 88, 128, 166, 204, 238, 280, 306].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 0 V120`} />
              {[26, 58, 90].map((y) => (
                <path key={y} d={`M${x - 4} ${y + (i % 3) * 6} H${x + 4}`} />
              ))}
            </g>
          ))}
          <path d="M58 40 q14 -8 28 -4 M166 70 q-14 -8 -26 -2 M238 30 q14 -8 26 -2 M128 20 q12 -10 26 -8" />
        </g>
      );
    case "castle":
      return (
        <g>
          <path d="M96 116 L112 84 H208 L224 116" />
          <rect x={124} y={62} width={72} height={22} />
          <path d="M104 64 Q160 48 216 64" />
          <rect x={138} y={42} width={44} height={20} />
          <path d="M120 44 Q160 30 200 44" />
          <rect x={150} y={26} width={20} height={16} />
          <path d="M138 28 Q160 14 182 28" />
        </g>
      );
    case "roof":
      return (
        <g>
          <path d="M30 66 Q160 26 290 66" />
          <path d="M70 70 H250" />
          <path d="M112 40 H208" />
          {[84, 116, 148, 180, 212, 236].map((x) => (
            <path key={x} d={`M${x} 70 V116`} />
          ))}
        </g>
      );
    case "alps":
      return (
        <g>
          <path d="M0 116 L50 62 L82 86 L132 28 L172 78 L212 46 L252 82 L292 52 L320 76" />
          <path d="M118 44 L126 52 L134 42 L142 52 M200 58 L208 64 L216 54 L222 62 M40 74 L48 80 L56 70" />
        </g>
      );
    case "gassho":
      return (
        <g>
          {[
            [68, 0.8],
            [160, 1],
            [252, 0.72],
          ].map(([cx, s]) => (
            <g key={cx}>
              <path d={`M${cx - 44 * s} ${BASE} L${cx} ${BASE - 86 * s} L${cx + 44 * s} ${BASE}`} />
              <path
                d={`M${cx - 22 * s} ${BASE - 43 * s} H${cx + 22 * s} M${cx - 32 * s} ${BASE - 22 * s} H${cx + 32 * s}`}
              />
              <rect x={cx - 6 * s} y={BASE - 60 * s} width={12 * s} height={10 * s} />
            </g>
          ))}
        </g>
      );
    case "shop":
      return (
        <g>
          <rect x={24} y={52} width={84} height={64} />
          <path d="M24 52 l10 10 l11 -10 l10 10 l11 -10 l10 10 l11 -10 l10 10 l11 -10" />
          <rect x={118} y={26} width={16} height={62} rx={2} />
          <rect x={146} y={38} width={74} height={78} />
          <rect x={232} y={62} width={70} height={54} />
          <circle cx={170} cy={70} r={8} />
          <circle cx={196} cy={70} r={8} />
        </g>
      );
    case "lights":
      return (
        <g>
          {Array.from({ length: 18 }, (_, i) => {
            const x = 16 + ((i * 53) % 290);
            const y = 14 + ((i * 37) % 96);
            const r = 4 + ((i * 7) % 12);
            return <circle key={i} cx={x} cy={y} r={r} />;
          })}
        </g>
      );
    case "tower":
      return (
        <g>
          <path d="M126 116 L154 30 H166 L194 116" />
          <path d="M138 82 H182 M148 52 H172" />
          <path d="M160 30 V2" />
          <path d="M134 94 L178 60 M186 94 L142 60 M146 62 L166 36 M174 62 L154 36" />
        </g>
      );
    case "plane":
      return (
        <g>
          <path d="M8 112 Q150 -6 300 48" strokeDasharray="4 9" />
          <path transform="translate(262 18) scale(1.9)" d="M2 16l20-6-2-2-7 2-5-6H6l3 7-4 1-2-2H1l1 4z" />
        </g>
      );
  }
}

/** Ilustración de trazo del destino, dibujada con el color del bloque. */
export function DestinationArt({ scene, className = "" }: { scene: Scene; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <SceneShapes scene={scene} />
    </svg>
  );
}
