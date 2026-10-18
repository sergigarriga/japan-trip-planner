import { TASKS } from "../data/trip";
import { useStored } from "../hooks";
import { daysBetween, shortDate, todayIso } from "../lib";
import { Icon } from "./Icon";

function dueLabel(due: string): { text: string; tone: "late" | "soon" | "later" } {
  const d = daysBetween(todayIso(), due);
  if (d < 0) return { text: `Venció el ${shortDate(due)}`, tone: "late" };
  if (d === 0) return { text: "Hoy", tone: "soon" };
  if (d <= 7) return { text: `En ${d} ${d === 1 ? "día" : "días"} · ${shortDate(due)}`, tone: "soon" };
  return { text: shortDate(due), tone: "later" };
}

export function Checklist() {
  const [done, setDone] = useStored<Record<string, boolean>>("tasks", {});

  const tasks = [...TASKS].sort((a, b) => (a.due ?? "0").localeCompare(b.due ?? "0"));
  // lo marcado por el usuario manda; si no ha tocado la tarea, vale el `done` del plan
  const isDone = (t: (typeof TASKS)[number]) => done[t.id] ?? !!t.done;
  const count = TASKS.filter(isDone).length;

  return (
    <section className="panel checklist">
      <h2>Antes de salir</h2>
      <p className="muted">
        {count} de {TASKS.length} hechas
      </p>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${(count / TASKS.length) * 100}%` }} />
      </div>
      <ul>
        {tasks.map((t) => {
          const due = t.due ? dueLabel(t.due) : undefined;
          const checked = isDone(t);
          return (
            <li key={t.id} className={checked ? "is-done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setDone((s) => ({ ...s, [t.id]: !checked }))}
                />
                <span className="box">
                  <Icon name="check" size={14} />
                </span>
                <span className="task">
                  <span className="task__label">{t.label}</span>
                  {t.hint && <small>{t.hint}</small>}
                </span>
                {due && !checked && <span className={`due due--${due.tone}`}>{due.text}</span>}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
