import { useEffect, useRef } from "react";
import { Icon } from "./Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: "sheet" | "full";
  className?: string;
};

/** Hoja modal (abajo en móvil, centrada en escritorio) sobre <dialog> nativo. */
export function Sheet({ open, onClose, title, children, variant = "sheet", className = "" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Safari iOS 26 no pinta el <dialog> bajo su barra de la URL: ahí se ve la página de detrás.
  // Mientras hay una hoja a pantalla completa, la página se oculta y solo queda su color de fondo.
  useEffect(() => {
    if (!open || variant !== "full") return;
    const root = document.documentElement;
    const y = window.scrollY;
    root.classList.add("has-full-sheet");
    return () => {
      root.classList.remove("has-full-sheet");
      window.scrollTo(0, y); // al cerrar, la página vuelve a donde estaba
    };
  }, [open, variant]);

  return (
    <dialog
      ref={ref}
      className={`sheet sheet--${variant} ${className}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
    >
      {open && (
        <div className="sheet__inner">
          <header className="sheet__head">
            <h2>{title}</h2>
            <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
              <Icon name="close" />
            </button>
          </header>
          <div className="sheet__body">{children}</div>
        </div>
      )}
    </dialog>
  );
}
