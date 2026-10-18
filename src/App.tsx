import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Phrase } from "./data/phrases";
import { BLOCKS, TRIP } from "./data/trip";
import { LANG_NAMES, LANGS, getLang, isLang, msg, setLang } from "./i18n";
import { m } from "./i18n/messages/app";
import { useStored } from "./hooks";
import { daysBetween, todayIso } from "./lib";
import { useTrip } from "./state";
import { StationSign } from "./components/StationSign";
import { DayLine } from "./components/DayLine";
import { DayView } from "./components/DayView";
import { TripView } from "./components/TripView";
import { Checklist } from "./components/Checklist";
import { Petals } from "./components/Petals";
import { MonthView } from "./components/MonthView";
import { PhraseCard, PhrasesView } from "./components/PhrasesView";
import { SearchPalette } from "./components/SearchPalette";
import { PlanEditor } from "./components/PlanEditor";
import { Countdown } from "./components/Countdown";
import { Icon } from "./components/Icon";
import { Welcome } from "./components/Welcome";

type Tab = "day" | "month" | "trip" | "tasks" | "phrases";
type Theme = "sakura" | "anden" | "neon";

const THEMES: { id: Theme; label: () => string }[] = [
  { id: "sakura", label: () => msg(m).themeSakura },
  { id: "anden", label: () => msg(m).themeAnden },
  { id: "neon", label: () => msg(m).themeNeon },
];

const TABS = [
  ["day", () => msg(m).tabDay, "今日"],
  ["month", () => msg(m).tabMonth, "月"],
  ["trip", () => msg(m).tabTrip, "旅"],
  ["tasks", () => msg(m).tabTasks, "準備"],
  ["phrases", () => msg(m).tabPhrases, "話"],
] as const;

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => unknown };

export default function App() {
  const t = msg(m);
  const { days, covers } = useTrip();
  const today = todayIso();
  const todayN = days.find((d) => d.date === today)?.n;

  const [n, setN] = useState(() => {
    if (todayN != null) return todayN;
    const saved = Number(new URLSearchParams(location.search).get("dia"));
    return days.some((d) => d.n === saved) ? saved : 1;
  });
  const [tab, setTab] = useState<Tab>(() => {
    const v = new URLSearchParams(location.search).get("vista");
    return TABS.some(([id]) => id === v) ? (v as Tab) : "day";
  });
  const [theme, setTheme] = useStored<Theme>("theme", "sakura");
  const [travel, setTravel] = useStored("travel", false);
  const [wake, setWake] = useStored("wake", false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [countdownOpen, setCountdownOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [phrase, setPhrase] = useState<(Phrase & { extra?: string }) | null>(null);
  const [dir, setDir] = useState<"left" | "right" | null>(null);
  const themeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number; t: number } | null>(null);

  const idx = days.findIndex((d) => d.n === n);
  const day = days[idx];
  const block = BLOCKS.find((b) => b.id === day.block)!;
  const countdown = daysBetween(today, TRIP.start);
  const themeInfo = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  // Enlaces compartibles: ?tema=neon&viaje=1
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("tema");
    if (THEMES.some((x) => x.id === t)) setTheme(t as Theme);
    if (params.has("viaje")) setTravel(params.get("viaje") === "1");
    const lang = params.get("idioma");
    if (isLang(lang)) setLang(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.set("dia", String(n));
    url.searchParams.set("vista", tab);
    history.replaceState(null, "", url);
  }, [n, tab]);

  const step = (delta: 1 | -1) => {
    const target = days[idx + delta];
    if (!target) return;
    setDir(delta > 0 ? "right" : "left");
    setN(target.n);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (tab !== "day" || typing || document.querySelector("dialog[open]")) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const go = (next: number) => {
    setDir(null);
    setN(next);
    setTab("day");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Deslizar a izquierda/derecha para cambiar de día.
  const onTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".line, input, textarea, select, .tripmap, .conv, .thumbs")) {
      touch.current = null;
      return;
    }
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - start.t < 700) step(dx < 0 ? 1 : -1);
  };

  // Cambio de tema con revelado circular desde el botón (View Transitions API).
  const cycleTheme = () => {
    const next = THEMES[(THEMES.indexOf(themeInfo) + 1) % THEMES.length].id;
    const doc = document as ViewTransitionDoc;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduced) return setTheme(next);
    const r = themeBtn.current?.getBoundingClientRect();
    if (r) {
      document.documentElement.style.setProperty("--vt-x", `${r.left + r.width / 2}px`);
      document.documentElement.style.setProperty("--vt-y", `${r.top + r.height / 2}px`);
    }
    doc.startViewTransition(() => flushSync(() => setTheme(next)));
  };

  const toggleTravel = () => {
    const on = !travel;
    setTravel(on);
    if (on && todayN != null) go(todayN);
  };

  return (
    <div className={`app${travel ? " is-travel" : ""}`}>
      {theme === "sakura" && <Petals />}

      <header className="topbar">
        <div>
          <p className="topbar__title">{TRIP.titleJa}</p>
          {countdown > 0 ? (
            <button className="topbar__status" onClick={() => setCountdownOpen(true)}>
              {t.daysLeft(countdown)}
            </button>
          ) : (
            <p className="topbar__status">{todayN != null ? t.todayIsDay(todayN) : t.tripOver}</p>
          )}
        </div>
        <div className="topbar__actions">
          <button
            className="pill pill--icon"
            onClick={() => setSearchOpen(true)}
            aria-label={t.search}
            title={t.searchTitle}
          >
            <Icon name="search" size={16} />
          </button>
          <button ref={themeBtn} className="pill" onClick={cycleTheme} aria-label={t.theme(themeInfo.label())}>
            <span className="swatch" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="pill__label">{themeInfo.label()}</span>
          </button>
          <button
            className={`pill pill--travel${travel ? " is-on" : ""}`}
            role="switch"
            aria-checked={travel}
            onClick={toggleTravel}
          >
            <span className="pill__dot" aria-hidden="true" />
            <span className="pill__label">{t.travelMode}</span>
          </button>
          <label className="pill pill--lang" title={t.language}>
            <Icon name="globe" size={16} />
            <span className="pill__code" aria-hidden="true">
              {getLang().toUpperCase()}
            </span>
            <select
              aria-label={t.language}
              value={getLang()}
              onChange={(e) => isLang(e.target.value) && setLang(e.target.value)}
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {LANG_NAMES[l]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      {/* Va aquí (antes del contenido) para poder ser sticky arriba en iPhone; en el resto es fixed abajo. */}
      <nav
        className="tabs"
        aria-label={t.sections}
        style={{ "--idx": TABS.findIndex(([id]) => id === tab) } as React.CSSProperties}
      >
        <div className="tabs__inner">
          <span className="tabs__bg" aria-hidden="true" />
          {TABS.map(([id, label, jp]) => (
            <button
              key={id}
              className={`tabs__btn${tab === id ? " is-active" : ""}`}
              onClick={() => {
                setTab(id);
                window.scrollTo({ top: 0 });
              }}
              aria-current={tab === id ? "page" : undefined}
            >
              <span className="tabs__jp">{jp}</span>
              {label()}
            </button>
          ))}
        </div>
      </nav>

      <main onTouchStart={tab === "day" ? onTouchStart : undefined} onTouchEnd={tab === "day" ? onTouchEnd : undefined}>
        {tab === "day" && (
          <div className="dayview">
            <div className="dayview__side">
              <StationSign
                day={day}
                block={block}
                prev={days[idx - 1]}
                next={days[idx + 1]}
                compact={travel}
                coverId={covers[day.date]}
                onGo={go}
              />
              <DayLine selected={n} today={todayN} onSelect={go} />
            </div>
            <div className="day-wrap" data-dir={dir ?? undefined} key={`${day.n}-${day.origin}`}>
              <DayView
                day={day}
                block={block}
                travel={travel}
                todayN={todayN}
                onGo={go}
                wake={wake}
                onWake={setWake}
                onEdit={() => setEditing(true)}
              />
            </div>
          </div>
        )}
        {tab === "month" && (
          <div className="view-in">
            <MonthView selected={n} todayIso={today} theme={theme} onOpen={go} />
          </div>
        )}
        {tab === "trip" && (
          <div className="view-in">
            <TripView onCountdown={() => setCountdownOpen(true)} />
          </div>
        )}
        {tab === "tasks" && (
          <div className="view-in">
            <Checklist />
          </div>
        )}
        {tab === "phrases" && (
          <div className="view-in">
            <PhrasesView onShow={setPhrase} />
          </div>
        )}
      </main>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} onGoDay={go} onPhrase={setPhrase} />
      <Countdown open={countdownOpen} onClose={() => setCountdownOpen(false)} />
      <PhraseCard phrase={phrase} onClose={() => setPhrase(null)} />
      <Welcome />
      {editing && <PlanEditor key={`${day.n}-${day.origin}`} day={day} onClose={() => setEditing(false)} />}
    </div>
  );
}
