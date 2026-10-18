import { useState } from "react";
import { DAYS } from "../data/trip";
import { newId, storeFiles } from "../db";
import { buzz } from "../lib";
import type { PlanDay, Reservation } from "../state";
import type { FileRef } from "../types";
import { useTrip } from "../state";
import { useFileUrl } from "../hooks";
import { FileThumb } from "./FileThumb";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

const empty = (origin: number, title = ""): Reservation => ({
  id: newId(),
  origin,
  title,
  code: "",
  when: "",
  note: "",
  files: [],
});

function FileViewer({ file, onClose }: { file: FileRef | null; onClose: () => void }) {
  const url = useFileUrl(file?.id);
  return (
    <Sheet open={!!file} onClose={onClose} title={file?.name ?? ""}>
      {url && file?.type.startsWith("image/") && <img className="viewer__img" src={url} alt={file.name} />}
      {url && !file?.type.startsWith("image/") && (
        <a className="btn btn--primary" href={url} target="_blank" rel="noreferrer">
          <Icon name="file" />
          Abrir archivo
        </a>
      )}
    </Sheet>
  );
}

export function Reservations({ day }: { day: PlanDay }) {
  const { reservations, saveReservation, removeReservation } = useTrip();
  const [draft, setDraft] = useState<Reservation | null>(null);
  const [viewing, setViewing] = useState<FileRef | null>(null);
  const [copied, setCopied] = useState<string>();
  const [busy, setBusy] = useState(false);

  const list = reservations.filter((r) => r.origin === day.origin);
  const hints = (DAYS[day.origin].bookings ?? []).filter((h) => !list.some((r) => r.title === h));

  const copy = async (r: Reservation) => {
    try {
      await navigator.clipboard.writeText(r.code);
      buzz();
      setCopied(r.id);
      setTimeout(() => setCopied(undefined), 1500);
    } catch {
      /* portapapeles no disponible */
    }
  };

  return (
    <div className="extra">
      {list.length === 0 && hints.length === 0 && (
        <p className="empty">
          Guarda aquí códigos, QR y billetes de este día para tenerlos a mano sin buscar en el correo.
        </p>
      )}

      <ul className="res-list">
        {list.map((r) => (
          <li key={r.id} className="res">
            <div className="res__main">
              <span className="res__icon">
                <Icon name="ticket" />
              </span>
              <div>
                <strong>{r.title}</strong>
                {(r.when || r.note) && <small>{[r.when, r.note].filter(Boolean).join(". ")}</small>}
              </div>
              <button className="icon-btn" onClick={() => setDraft(r)} aria-label={`Editar ${r.title}`}>
                <Icon name="edit" size={16} />
              </button>
            </div>
            {r.code && (
              <button className="res__code" onClick={() => copy(r)}>
                <span>{r.code}</span>
                <small>{copied === r.id ? "Copiado" : "Copiar"}</small>
              </button>
            )}
            {r.files.length > 0 && (
              <div className="thumbs">
                {r.files.map((f) => (
                  <FileThumb key={f.id} file={f} onClick={() => setViewing(f)} />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {hints.length > 0 && (
        <div className="hints">
          <p className="hints__label">Sugeridas para este día</p>
          <div className="hints__row">
            {hints.map((h) => (
              <button key={h} className="hint" onClick={() => setDraft(empty(day.origin, h))}>
                <Icon name="plus" size={14} />
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="btn btn--ghost btn--block" onClick={() => setDraft(empty(day.origin))}>
        <Icon name="plus" />
        Añadir reserva
      </button>

      <Sheet
        open={!!draft}
        onClose={() => setDraft(null)}
        title={list.some((r) => r.id === draft?.id) ? "Editar reserva" : "Nueva reserva"}
      >
        {draft && (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.title.trim()) return;
              saveReservation(draft);
              buzz();
              setDraft(null);
            }}
          >
            <label>
              <span>Qué es</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Entradas DisneySea"
                required
              />
            </label>
            <div className="form__row">
              <label>
                <span>Código de reserva</span>
                <input
                  value={draft.code}
                  onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                  placeholder="ABC123"
                />
              </label>
              <label>
                <span>Hora o asiento</span>
                <input
                  value={draft.when}
                  onChange={(e) => setDraft({ ...draft, when: e.target.value })}
                  placeholder="09:30, coche 7, asientos E"
                />
              </label>
            </div>
            <label>
              <span>Nota</span>
              <textarea rows={2} value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} />
            </label>
            <div className="form__files">
              <span>QR, capturas o PDF</span>
              <div className="thumbs">
                {draft.files.map((f) => (
                  <div key={f.id} className="thumb-wrap">
                    <FileThumb file={f} onClick={() => setViewing(f)} />
                    <button
                      type="button"
                      className="thumb-del"
                      aria-label={`Quitar ${f.name}`}
                      onClick={() => setDraft({ ...draft, files: draft.files.filter((x) => x.id !== f.id) })}
                    >
                      <Icon name="close" size={12} />
                    </button>
                  </div>
                ))}
                <label className="thumb thumb--add">
                  <Icon name={busy ? "clock" : "camera"} size={20} />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={async (e) => {
                      setBusy(true);
                      const files = await storeFiles(e.target.files);
                      setDraft((d) => (d ? { ...d, files: [...d.files, ...files] } : d));
                      setBusy(false);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="form__actions">
              {list.some((r) => r.id === draft.id) && (
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => {
                    removeReservation(draft.id);
                    setDraft(null);
                  }}
                >
                  <Icon name="trash" />
                  Borrar
                </button>
              )}
              <button type="submit" className="btn btn--primary">
                Guardar reserva
              </button>
            </div>
          </form>
        )}
      </Sheet>

      <FileViewer file={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
