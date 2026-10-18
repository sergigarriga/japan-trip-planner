import { useState } from "react";
import type { Phrase } from "../data/phrases";
import { EMERGENCY, PHRASE_GROUPS } from "../data/phrases";
import { STAYS } from "../data/trip";
import { LANGS, getLang, msg, tc, type Lang } from "../i18n";
import { m } from "../i18n/messages/phrasesView";
import { shortDate, speak } from "../lib";
import { useTrip } from "../state";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

/** Tarjeta a pantalla completa para enseñar el móvil. */
export function PhraseCard({ phrase, onClose }: { phrase: (Phrase & { extra?: string }) | null; onClose: () => void }) {
  const t = msg(m);
  const lang = getLang();
  return (
    <Sheet open={!!phrase} onClose={onClose} title={phrase?.meaning[lang] ?? ""} variant="full" className="show">
      {phrase && (
        <div className="show__card">
          {phrase.extra && <p className="show__extra">{phrase.extra}</p>}
          <p className="show__jp" lang="ja">
            {phrase.jp}
          </p>
          {phrase.romaji && <p className="show__romaji">{phrase.romaji}</p>}
          <p className="show__es">{phrase.meaning[lang]}</p>
          <button
            className="btn btn--primary"
            onClick={() => speak(phrase.extra ? `${phrase.extra}。${phrase.jp}` : phrase.jp)}
          >
            <Icon name="speak" />
            {t.listen}
          </button>
        </div>
      )}
    </Sheet>
  );
}

/** "Llévenos a <hotel>" en los cuatro idiomas: la tarjeta sigue bien si se cambia de idioma con ella abierta. */
function taxiMeaning(name: string): Record<Lang, string> {
  return Object.fromEntries(LANGS.map((l) => [l, m[l].taxiTo(name || m[l].ourHotel)])) as Record<Lang, string>;
}

export function PhrasesView({ onShow }: { onShow: (p: Phrase & { extra?: string }) => void }) {
  const { stays, setStay } = useTrip();
  const [editing, setEditing] = useState<number | null>(null);
  const t = msg(m);
  const lang = getLang();

  return (
    <div className="phrases">
      <section className="panel">
        <h2>{t.taxiTitle}</h2>
        <p className="muted">{t.taxiHint}</p>
        <ul className="taxi">
          {STAYS.map((s, i) => {
            const info = stays[i] ?? { name: "", address: "" };
            return (
              <li key={s.from} data-block={s.block}>
                <div className="taxi__head">
                  <span className="taxi__kanji">{s.kanji}</span>
                  <div>
                    <strong>{info.name || t.hotel(tc(s.city))}</strong>
                    <small>{t.since(shortDate(s.from), s.nights)}</small>
                  </div>
                  <button
                    className="icon-btn"
                    onClick={() => setEditing(editing === i ? null : i)}
                    aria-label={t.editHotel}
                  >
                    <Icon name="edit" size={16} />
                  </button>
                </div>
                {editing === i ? (
                  <div className="form">
                    <label>
                      <span>{t.hotelName}</span>
                      <input
                        value={info.name}
                        onChange={(e) => setStay(i, { ...info, name: e.target.value })}
                        placeholder="APA Hotel Shinjuku"
                      />
                    </label>
                    <label>
                      <span>{t.address}</span>
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
                        meaning: taxiMeaning(info.name),
                        extra: "この住所までお願いします",
                      })
                    }
                  >
                    {t.showDriver}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      {PHRASE_GROUPS.map((g) => (
        <section key={g.id} className="panel">
          <h2>{g.title[lang]}</h2>
          <ul className="phrase-list">
            {g.phrases.map((p) => (
              <li key={p.jp}>
                <button className="phrase" onClick={() => onShow(p)}>
                  <span className="phrase__es">{p.meaning[lang]}</span>
                  <span className="phrase__jp" lang="ja">
                    {p.jp}
                  </span>
                  <small>{p.romaji}</small>
                </button>
                <button className="icon-btn" onClick={() => speak(p.jp)} aria-label={t.listenTo(p.meaning[lang])}>
                  <Icon name="speak" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="panel">
        <h2>{t.emergencies}</h2>
        <ul className="sos">
          {EMERGENCY.map((e) => (
            <li key={e.number}>
              <a href={`tel:${e.number.replace(/\D/g, "")}`}>
                <span>{e.label[lang]}</span>
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
