import { useEffect, useMemo, useState } from "react";
import { DAYS } from "../data/trip";
import { msg } from "../i18n";
import { m } from "../i18n/messages/weather";
import { daysBetween, monthName, storageKey, todayIso } from "../lib";
import { Icon, type IconName } from "./Icon";

type Wx = { source: "forecast" | "climate"; hi: number; lo: number; code?: number; rain?: number };

const CACHE_MS = 3 * 3600_000;

/** Icono y texto del código WMO; se evalúa al pintar para usar el idioma actual. */
function describe(code?: number): { icon: IconName; label: string } {
  const t = msg(m);
  if (code == null) return { icon: "cloud", label: t.monthAvg };
  if (code === 0) return { icon: "sun", label: t.clear };
  if (code <= 3) return { icon: "cloud", label: t.partly };
  if (code <= 48) return { icon: "fog", label: t.fog };
  if (code <= 67 || (code >= 80 && code <= 82)) return { icon: "rain", label: t.rain };
  if (code <= 77 || code === 85 || code === 86) return { icon: "snow", label: t.snow };
  return { icon: "storm", label: t.storm };
}

function readCache(key: string): Wx | undefined {
  try {
    const cached = JSON.parse(localStorage.getItem(key) ?? "null");
    return cached && Date.now() - cached.t < CACHE_MS ? cached.wx : undefined;
  } catch {
    return undefined;
  }
}

function writeCache(key: string, wx: Wx) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), wx }));
  } catch {
    /* sin caché */
  }
}

/** Previsión de Open-Meteo para los próximos 15 días; antes, la media histórica del lugar. */
function useWeather(date: string, origin: number): Wx {
  const geo = DAYS[origin].geo;
  const ahead = daysBetween(todayIso(), date);
  const inRange = ahead >= 0 && ahead <= 15;
  const key = `${storageKey("wx")}:${date}:${geo.lat},${geo.lon}`;
  const cached = useMemo(() => (inRange ? readCache(key) : undefined), [inRange, key]);
  const [fetched, setFetched] = useState<{ key: string; wx: Wx }>();

  useEffect(() => {
    if (!inRange || cached) return;
    const params = new URLSearchParams({
      latitude: String(geo.lat),
      longitude: String(geo.lon),
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto",
      start_date: date,
      end_date: date,
    });
    const ctrl = new AbortController();
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        const wx: Wx = {
          source: "forecast",
          hi: Math.round(j.daily.temperature_2m_max[0]),
          lo: Math.round(j.daily.temperature_2m_min[0]),
          code: j.daily.weather_code[0],
          rain: j.daily.precipitation_probability_max[0],
        };
        setFetched({ key, wx });
        writeCache(key, wx);
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, [inRange, cached, key, date, geo.lat, geo.lon]);

  if (fetched?.key === key) return fetched.wx;
  return cached ?? { source: "climate", hi: geo.climate[0], lo: geo.climate[1] };
}

export function WeatherBadge({ date, origin }: { date: string; origin: number }) {
  const wx = useWeather(date, origin);
  const t = msg(m);
  const d = describe(wx.code);
  const cold = wx.lo <= 3;

  return (
    <div className={`wx${cold ? " wx--cold" : ""}`}>
      <span className="wx__icon">
        <Icon name={d.icon} size={20} />
      </span>
      <div>
        <strong>
          {wx.hi}° <span>/ {wx.lo}°</span>
        </strong>
        <small>
          {wx.source === "forecast" ? d.label : t.avgOf(monthName(date))}
          {wx.rain != null && wx.rain >= 30 ? t.rainPct(wx.rain) : ""}
          {cold ? t.coat : ""}
        </small>
      </div>
    </div>
  );
}
