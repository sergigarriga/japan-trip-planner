import { BLOCKS } from "../data/trip";

/** Colores por tema en styles.css (`--c-1` … `--c-4`); los bloques los reutilizan en orden. */
const PALETTE_SIZE = 4;

/** Variable CSS con el color de un bloque, según su posición en BLOCKS. */
export function blockColorVar(blockId: string): string {
  const i = Math.max(
    0,
    BLOCKS.findIndex((b) => b.id === blockId),
  );
  return `--c-${(i % PALETTE_SIZE) + 1}`;
}

/** Crea las reglas `[data-block]` para que cada bloque pinte con su color de línea. */
export function applyBlockColors(doc: Document = document): void {
  const style = doc.createElement("style");
  style.dataset.blocks = "";
  style.textContent = BLOCKS.map((b) => `[data-block="${CSS.escape(b.id)}"]{--line:var(${blockColorVar(b.id)})}`).join(
    "\n",
  );
  doc.head.append(style);
}
