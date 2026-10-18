import { useState } from "react";
import type { Phrase } from "../data/phrases";
import { EMERGENCY, PHRASE_GROUPS } from "../data/phrases";
import { STAYS } from "../data/trip";
import { shortDate, speak } from "../lib";
import { useTrip } from "../state";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

/** Tarjeta a pantalla completa para enseñar el móvil. */
export function PhraseCard({ phrase, onClose }: { phrase: (Phrase & { extra?: string }) | null; onClose: () => void }) {
  return (
    <Sheet open={!!phrase} onClose={onClose} title={phrase?.es ?? ""} variant="full" className="show">
      {phrase && (
        <div className="show__card">
          {phrase.extra && <p className="show__extra">{phrase.extra}</p>}
          <p className="show__jp" lang="ja">
            {phrase.jp}
          </p>
          {phrase.romaji && <p className="show__romaji">{phrase.romaji}</p>}
          <p className="show__es">{phrase.es}</p>
          <button
            className="btn btn--primary"
            onClick={() => speak(phrase.extra ? `${phrase.extra}。${phrase.jp}` : phrase.jp)}
          >
            <Icon name="speak" />
            Escuchar
          </button>
        </div>
      )}
    </Sheet>
  );
}

export function PhrasesView({ onShow }: { onShow: (p: Phrase & { extra?: string }) => void }) {
  const { stays, setStay } = useTrip();
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div className="phrases">
      <section className="panel">
        <h2>Para el taxi</h2>
        <p className="muted">
          Guarda el nombre y la dirección en japonés de cada hotel (viene en la confirmación de la reserva).
        </p>
        <ul className="taxi">
          {STAYS.map((s, i) => {
            const info = stays[i] ?? { name: "", address: "" };
            return (
              <li key={s.from} data-block={s.block}>
                <div className="taxi__head">
                  <span className="taxi__kanji">{s.kanji}</span>
                  <div>
                    <strong>{info.name || `Hotel ${s.city}`}</strong>
                    <small>
                      Desde el {shortDate(s.from)}, {s.nights} {s.nights === 1 ? "noche" : "noches"}
                    </small>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={() => setEditing(editing === i ? null : i)}
                    aria-label="Editar hotel"
                  >
                    <Icon name="edit" size={16} />
                  </button>
                </div>
                {editing === i ? (
                  <div className="form">
                    <label>
                      <span>Nombre del hotel</span>
                      <input
                        value={info.name}
                        onChange={(e) => setStay(i, { ...info, name: e.target.value })}
                        placeholder="APA Hotel Shinjuku"
                      />
                    </label>
                    <label>
                      <span>Dirección en japonés</span>
                      <textarea
                        rows={2}
                        lang="ja"
                        value={info.address}
                        onChange={(e) => setStay(i, { ...info, address: e.target.value })}
                        placeholder="東京都新宿区…"
                      />
                    </label>
                  </div>
                ) : info.address ? (
                  <button
                    className="btn btn--ghost btn--block"
                    onClick={() =>
                      onShow({
                        jp: info.address,
                        romaji: "",
                        es: `Llévenos a ${info.name || "nuestro hotel"}, por favor`,
                        extra: "この住所までお願いします",
                      })
                    }
                  >
                    Enseñar al taxista
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {PHRASE_GROUPS.map((g) => (
        <section key={g.title} className="panel">
          <h2>{g.title}</h2>
          <ul className="phrase-list">
            {g.phrases.map((p) => (
              <li key={p.jp}>
                <button className="phrase" onClick={() => onShow(p)}>
                  <span className="phrase__es">{p.es}</span>
                  <span className="phrase__jp" lang="ja">
                    {p.jp}
                  </span>
                  <small>{p.romaji}</small>
                </button>
                <button className="icon-btn" onClick={() => speak(p.jp)} aria-label={`Escuchar: ${p.es}`}>
                  <Icon name="speak" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="panel">
        <h2>Emergencias</h2>
        <ul className="sos">
          {EMERGENCY.map((e) => (
            <li key={e.number}>
              <a href={`tel:${e.number.replace(/\D/g, "")}`}>
                <span>{e.label}</span>
                <strong>
                  <Icon name="phone" size={16} />
                  {e.number}
                </strong>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
