import { useState } from "react";
import type { FileRef } from "../types";
import { useTrip } from "../state";
import { useFileUrl } from "../hooks";
import { msg } from "../i18n";
import { m } from "../i18n/messages/journal";
import { FileThumb } from "./FileThumb";
import { Icon } from "./Icon";
import { storeFiles } from "../db";
import { Sheet } from "./Sheet";

export function Journal({ date }: { date: string }) {
  const { notes, setNote, photos, addPhoto, removePhoto, covers, setCover } = useTrip();
  const t = msg(m);
  const [viewing, setViewing] = useState<FileRef | null>(null);
  const [busy, setBusy] = useState(false);
  const url = useFileUrl(viewing?.id);
  const list = photos[date] ?? [];
  const isCover = viewing && covers[date] === viewing.id;

  return (
    <div className="extra">
      <label className="journal__note">
        <span>{t.notes}</span>
        <textarea
          rows={4}
          placeholder={t.notesPlaceholder}
          value={notes[date] ?? ""}
          onChange={(e) => setNote(date, e.target.value)}
        />
      </label>

      <div className="journal__photos">
        <span>{t.photos}</span>
        <div className="thumbs thumbs--grid">
          {list.map((f) => (
            <div key={f.id} className={`thumb-wrap${covers[date] === f.id ? " is-cover" : ""}`}>
              <FileThumb file={f} onClick={() => setViewing(f)} />
            </div>
          ))}
          <label className="thumb thumb--add">
            <Icon name={busy ? "clock" : "camera"} size={22} />
            <small>{busy ? t.saving : t.add}</small>
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
        <p className="muted journal__hint">{t.hint}</p>
      </div>

      <Sheet open={!!viewing} onClose={() => setViewing(null)} title={t.photo}>
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
                {t.remove}
              </button>
              <button className="btn btn--primary" onClick={() => setCover(date, isCover ? null : viewing.id)}>
                <Icon name={isCover ? "close" : "check"} />
                {isCover ? t.uncover : t.cover}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}
