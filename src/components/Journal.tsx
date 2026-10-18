import { useState } from "react";
import type { FileRef } from "../types";
import { useTrip } from "../state";
import { useFileUrl } from "../hooks";
import { FileThumb } from "./FileThumb";
import { Icon } from "./Icon";
import { storeFiles } from "../db";
import { Sheet } from "./Sheet";

export function Journal({ date }: { date: string }) {
  const { notes, setNote, photos, addPhoto, removePhoto, covers, setCover } = useTrip();
  const [viewing, setViewing] = useState<FileRef | null>(null);
  const [busy, setBusy] = useState(false);
  const url = useFileUrl(viewing?.id);
  const list = photos[date] ?? [];
  const isCover = viewing && covers[date] === viewing.id;

  return (
    <div className="extra">
      <label className="journal__note">
        <span>Notas del día</span>
        <textarea
          rows={4}
          placeholder="Qué os ha gustado, dónde comisteis, qué repetiríais…"
          value={notes[date] ?? ""}
          onChange={(e) => setNote(date, e.target.value)}
        />
      </label>

      <div className="journal__photos">
        <span>Fotos</span>
        <div className="thumbs thumbs--grid">
          {list.map((f) => (
            <div key={f.id} className={`thumb-wrap${covers[date] === f.id ? " is-cover" : ""}`}>
              <FileThumb file={f} onClick={() => setViewing(f)} />
            </div>
          ))}
          <label className="thumb thumb--add">
            <Icon name={busy ? "clock" : "camera"} size={22} />
            <small>{busy ? "Guardando" : "Añadir"}</small>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                setBusy(true);
                const files = await storeFiles(e.target.files);
                files.forEach((f) => addPhoto(date, f));
                setBusy(false);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <p className="muted journal__hint">
          Las fotos se guardan solo en este móvil. Marca una como portada para verla en el cartel del día.
        </p>
      </div>

      <Sheet open={!!viewing} onClose={() => setViewing(null)} title="Foto del día">
        {viewing && (
          <>
            {url && <img className="viewer__img" src={url} alt="" />}
            <div className="form__actions">
              <button
                className="btn btn--danger"
                onClick={() => {
                  removePhoto(date, viewing.id);
                  setViewing(null);
                }}
              >
                <Icon name="trash" />
                Borrar
              </button>
              <button className="btn btn--primary" onClick={() => setCover(date, isCover ? null : viewing.id)}>
                <Icon name={isCover ? "close" : "check"} />
                {isCover ? "Quitar de portada" : "Usar de portada"}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}
