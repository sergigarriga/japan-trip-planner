import { useState } from "react";
import { TRIP } from "../data/trip";
import { msg } from "../i18n";
import { m } from "../i18n/messages/expenses";
import { eur, shortDate, yen, yenToEur } from "../lib";
import type { ExpenseCat } from "../state";
import { EXPENSE_CATS, useTrip } from "../state";
import { Icon } from "./Icon";

const NAMES = TRIP.travellers;
const catLabel = (id: ExpenseCat) => EXPENSE_CATS.find((c) => c.id === id)!.label();

export function DayExpenses({ date }: { date: string }) {
  const { expenses, addExpense, removeExpense } = useTrip();
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<ExpenseCat>("food");
  const [note, setNote] = useState("");
  const [paidBy, setPaidBy] = useState<0 | 1>(0);
  const [shared, setShared] = useState(true);
  const t = msg(m);

  const list = expenses.filter((e) => e.date === date);
  const total = list.reduce((a, e) => a + e.yen, 0);
  const value = Number(amount.replace(/\D/g, "")) || 0;

  return (
    <div className="extra">
      <form
        className="spend"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value) return;
          addExpense({ date, yen: value, cat, note: note.trim(), paidBy, shared });
          setAmount("");
          setNote("");
        }}
      >
        <div className="spend__amount">
          <input
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label={t.amount}
          />
          <span>¥</span>
          <small>{eur(value ? yenToEur(value) : 0)}</small>
        </div>
        <div className="chips" role="radiogroup" aria-label={t.category}>
          {EXPENSE_CATS.map((c) => (
            <button
              type="button"
              key={c.id}
              role="radio"
              aria-checked={cat === c.id}
              className={`chip-opt${cat === c.id ? " is-on" : ""}`}
              onClick={() => setCat(c.id)}
            >
              {c.label()}
            </button>
          ))}
        </div>
        <input
          className="spend__note"
          placeholder={t.notePlaceholder}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="spend__row">
          <div className="seg" role="radiogroup" aria-label={t.whoPaid}>
            {NAMES.map((name, i) => (
              <button
                type="button"
                key={name}
                role="radio"
                aria-checked={paidBy === i}
                className={paidBy === i ? "is-on" : ""}
                onClick={() => setPaidBy(i as 0 | 1)}
              >
                {t.paidByName(name)}
              </button>
            ))}
          </div>
          <label className="check">
            <input type="checkbox" checked={shared} onChange={(e) => setShared(e.target.checked)} />
            {t.forBoth}
          </label>
        </div>
        <button className="btn btn--primary btn--block" disabled={!value}>
          <Icon name="plus" />
          {t.add}
        </button>
      </form>

      {list.length > 0 && (
        <>
          <ul className="spend-list">
            {list.map((e) => (
              <li key={e.id}>
                <div>
                  <strong>{e.note || catLabel(e.cat)}</strong>
                  <small>{t.meta(catLabel(e.cat), NAMES[e.paidBy], e.shared)}</small>
                </div>
                <span className="spend-list__amt">
                  {yen(e.yen)}
                  <small>{eur(yenToEur(e.yen))}</small>
                </span>
                <button className="icon-btn" onClick={() => removeExpense(e.id)} aria-label={t.remove}>
                  <Icon name="trash" size={16} />
                </button>
              </li>
            ))}
          </ul>
          <p className="spend-total">
            {t.dayTotal} <strong>{yen(total)}</strong> <span className="muted">({eur(yenToEur(total))})</span>
          </p>
        </>
      )}
    </div>
  );
}

/** Gastos reales frente al presupuesto, por categoría, por día y quién debe a quién. */
export function ExpenseReport() {
  const { expenses, days } = useTrip();
  const t = msg(m);

  if (expenses.length === 0) {
    return (
      <section className="panel">
        <h2>{t.title}</h2>
        <p className="empty">{t.empty}</p>
      </section>
    );
  }

  const perPerson = (y: number) => yenToEur(y / NAMES.length);
  const total = expenses.reduce((a, e) => a + e.yen, 0);
  const budget = EXPENSE_CATS.reduce((a, c) => a + c.budget, 0);

  // Saldo a favor del primer viajero: en gastos compartidos, cada uno debe la mitad al que pagó.
  const balance = expenses.filter((e) => e.shared).reduce((a, e) => a + (e.paidBy === 0 ? e.yen / 2 : -e.yen / 2), 0);
  const [creditor, debtor] = balance > 0 ? [NAMES[0], NAMES[1]] : [NAMES[1], NAMES[0]];

  const byDay = days.map((d) => ({ d, yen: expenses.filter((e) => e.date === d.date).reduce((a, e) => a + e.yen, 0) }));
  const maxDay = Math.max(1, ...byDay.map((x) => x.yen));

  return (
    <section className="panel">
      <h2>{t.title}</h2>
      <p className="report__total">
        <strong>{eur(perPerson(total))}</strong>
        <span className="muted"> {t.ofBudget(eur(budget))}</span>
      </p>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${Math.min(100, (perPerson(total) / budget) * 100)}%` }} />
      </div>

      <ul className="report__cats">
        {EXPENSE_CATS.map((c) => {
          const real = perPerson(expenses.filter((e) => e.cat === c.id).reduce((a, e) => a + e.yen, 0));
          if (!real && !c.budget) return null;
          const over = c.budget > 0 && real > c.budget;
          return (
            <li key={c.id} className={over ? "is-over" : ""}>
              <div className="budget__row">
                <span>{c.label()}</span>
                <b>
                  {eur(real)}
                  {c.budget > 0 && <span className="muted"> / {eur(c.budget)}</span>}
                </b>
              </div>
              <div className="meter meter--thin">
                <span style={{ width: `${c.budget ? Math.min(100, (real / c.budget) * 100) : 100}%` }} />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="report__days" aria-label={t.byDay}>
        {byDay.map(({ d, yen: y }) => (
          <div key={d.n} className="report__day" data-block={d.block} title={`${shortDate(d.date)}: ${yen(y)}`}>
            <span style={{ height: `${(y / maxDay) * 100}%` }} />
            <small>{d.n}</small>
          </div>
        ))}
      </div>

      <p className="report__balance">
        {Math.abs(balance) < 1
          ? t.even
          : t.debt(debtor, yen(Math.round(Math.abs(balance))), eur(yenToEur(Math.abs(balance))), creditor)}
      </p>
    </section>
  );
}
