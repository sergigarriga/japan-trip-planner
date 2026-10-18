import { TASKS } from "../data/trip";
import { useStored } from "../hooks";
import { msg, tc } from "../i18n";
import { m } from "../i18n/messages/checklist";
import { daysBetween, shortDate, todayIso } from "../lib";
import { Icon } from "./Icon";

function dueLabel(due: string): { text: string; tone: "late" | "soon" | "later" } {
  const t = msg(m);
  const d = daysBetween(todayIso(), due);
  if (d < 0) return { text: t.overdue(shortDate(due)), tone: "late" };
  if (d === 0) return { text: t.today, tone: "soon" };
  if (d <= 7) return { text: t.inDays(d, shortDate(due)), tone: "soon" };
  return { text: shortDate(due), tone: "later" };
}

export function Checklist() {
  const [done, setDone] = useStored<Record<string, boolean>>("tasks", {});
  const t = msg(m);

  const tasks = [...TASKS].sort((a, b) => (a.due ?? "0").localeCompare(b.due ?? "0"));
  // lo marcado por el usuario manda; si no ha tocado la tarea, vale el `done` del plan
  const isDone = (task: (typeof TASKS)[number]) => done[task.id] ?? !!task.done;
  const count = TASKS.filter(isDone).length;

  return (
    <section className="panel checklist">
      <h2>{t.title}</h2>
      <p className="muted">{t.progress(count, TASKS.length)}</p>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${(count / TASKS.length) * 100}%` }} />
      </div>
      <ul>
        {tasks.map((task) => {
          const due = task.due ? dueLabel(task.due) : undefined;
          const checked = isDone(task);
          return (
            <li key={task.id} className={checked ? "is-done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setDone((s) => ({ ...s, [task.id]: !checked }))}
                />
                <span className="box">
                  <Icon name="check" size={14} />
                </span>
                <span className="task">
                  <span className="task__label">{tc(task.label)}</span>
                  {task.hint && <small>{tc(task.hint)}</small>}
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
