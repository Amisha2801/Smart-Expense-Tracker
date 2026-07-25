import { useCallback, useEffect, useState } from "react";
import {
  createBudget,
  createCategory,
  deleteBudget,
  getBudgets,
  getCategories,
} from "../api/budgetApi";
import { getTransactions } from "../api/transactionApi";
import {
  ChevronLeft, ChevronRight, CircleCheckBig, Plus, Repeat, TriangleAlert,
} from "lucide-react";
import {
  Button, Dialog, TextField, Select, SegmentedControl, StatusBanner, ProgressBar,
} from "../design-system/components";
import { formatCents, getMonthKey, monthKeyToLabel, getCurrentMonthKey } from "../utils/moneyUtils";
import "./Budget.css";

const CATEGORY_COLORS = [
  "#3f6f4f", "#c26a3d", "#4a6b8a", "#8a6d9a",
  "#b08a2e", "#5f6f5a", "#3f8078", "#a05a7a",
];

function addMonths(monthKey, delta) {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function Budget() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());

  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catKind, setCatKind] = useState("expense");
  const [catColor, setCatColor] = useState(CATEGORY_COLORS[0]);

  const [budDialogOpen, setBudDialogOpen] = useState(false);
  const [budCategoryId, setBudCategoryId] = useState("");
  const [budAmount, setBudAmount] = useState("");
  const [budNotes, setBudNotes] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [catData, budData, txData] = await Promise.all([
        getCategories(),
        getBudgets(),
        getTransactions(),
      ]);
      setCategories(catData.data || []);
      setBudgets(budData.data || []);
      setTransactions(txData.data || []);
    } catch {
      setError("Unable to load budget data.");
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const monthBudgets = budgets.filter(
    b => getMonthKey(b.period_month) === currentMonth
  );

  const monthTransactions = transactions.filter(
    tx => tx.occurred_on?.slice(0, 7) === currentMonth
  );

  const totalIncome = monthTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount_cents, 0);

  const totalAllocated = monthBudgets.reduce((sum, b) => sum + b.allocated_cents, 0);
  const totalSpent = monthTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount_cents, 0);
  const readyToAssign = totalIncome - totalAllocated;

  const envelopes = monthBudgets.map(budget => {
    const cat = categories.find(c => c.id === budget.category_id);
    const spent = monthTransactions
      .filter(tx => tx.category_id === budget.category_id && tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount_cents, 0);
    const left = budget.allocated_cents - spent;
    const pct = budget.allocated_cents > 0
      ? Math.min(100, Math.round((spent / budget.allocated_cents) * 100))
      : 0;
    return { budget, cat, spent, left, pct, isOver: spent > budget.allocated_cents };
  });

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) { setError("Category name is required."); return; }
    try {
      setError(""); setMessage("");
      const data = await createCategory({ name: catName.trim(), kind: catKind, color: catColor, icon: "💰" });
      if (data.error) { setError(data.error); return; }
      setMessage("Category created.");
      setCatName(""); setCatKind("expense"); setCatColor(CATEGORY_COLORS[0]);
      setCatDialogOpen(false);
      await loadData();
    } catch {
      setError("Unable to create category.");
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    if (!budCategoryId || !budAmount) {
      setError("Category and amount are required.");
      return;
    }
    try {
      setError(""); setMessage("");
      const data = await createBudget({
        categoryId: budCategoryId,
        periodMonth: currentMonth,
        amountDollars: budAmount,
        notes: budNotes,
      });
      if (data.error) { setError(data.error); return; }
      setMessage("Envelope created.");
      setBudCategoryId(""); setBudAmount(""); setBudNotes("");
      setBudDialogOpen(false);
      await loadData();
    } catch {
      setError("Unable to create envelope.");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      setError(""); setMessage("");
      const data = await deleteBudget(budgetId);
      if (data.error) { setError(data.error); return; }
      setMessage("Envelope deleted.");
      await loadData();
    } catch {
      setError("Unable to delete envelope.");
    }
  };

  const expenseCategories = categories.filter(c => c.kind === "expense");

  return (
    <div className="page bud-page">
      {/* Header */}
      <header className="bud-header">
        <div>
          <h1>Budget</h1>
          <p className="bud-header__sub">Give every dollar a job · {monthKeyToLabel(currentMonth)}</p>
        </div>

        <div className="bud-month-nav">
          <button
            type="button"
            className="bud-month-nav__btn"
            onClick={() => setCurrentMonth(m => addMonths(m, -1))}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="bud-month-nav__label">{monthKeyToLabel(currentMonth)}</span>
          <button
            type="button"
            className="bud-month-nav__btn"
            onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </header>

      <StatusBanner error={error} message={message} />

      {/* Hero stats */}
      <div className="bud-hero-row">
        <div className={`bud-hero-card bud-hero-card--${readyToAssign >= 0 ? "pos" : "neg"}`}>
          <span className="bud-hero-card__icon">
            <CircleCheckBig size={22} />
          </span>
          <div>
            <div
              className="bud-hero-card__amount figs"
              style={{ color: readyToAssign >= 0 ? "var(--pos)" : "var(--neg)" }}
            >
              {readyToAssign < 0 && "–"}
              {formatCents(Math.abs(readyToAssign))}
            </div>
            <div className="bud-hero-card__label"></div>
          </div>
        </div>

        <div className="bud-stat-card">
          <div className="bud-stat-card__label">Budgeted</div>
          <div className="bud-stat-card__value figs">{formatCents(totalAllocated)}</div>
        </div>

        <div className="bud-stat-card">
          <div className="bud-stat-card__label">Spent so far</div>
          <div className="bud-stat-card__value figs">{formatCents(totalSpent)}</div>
        </div>
      </div>

      {/* Envelopes section */}
      <div className="bud-section-header">
        <h2>Envelopes</h2>
        <div className="bud-section-header__actions">
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => { setError(""); setMessage(""); setCatDialogOpen(true); }}
          >
            New category
          </Button>
          <Button
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => { setError(""); setMessage(""); setBudDialogOpen(true); }}
          >
            Add envelope
          </Button>
        </div>
      </div>

      {envelopes.length === 0 ? (
        <div className="bud-empty">
          <p>No envelopes for {monthKeyToLabel(currentMonth)}.</p>
          <p style={{ marginTop: 6, fontSize: 13 }}>
            Add a category first, then create an envelope to give your money a job.
          </p>
        </div>
      ) : (
        <div className="bud-envelope-list">
          {envelopes.map(({ budget, cat, spent, left, pct, isOver }) => (
            <div key={budget.id} className="bud-envelope-row">
              <div className="bud-envelope-row__name">
                <span
                  className="bud-envelope-row__dot"
                  style={{ background: cat?.color || "var(--muted)" }}
                />
                <span className="bud-envelope-row__label">{cat?.name || "Uncategorized"}</span>
              </div>

              <div className="bud-envelope-row__bar">
                <ProgressBar
                  value={spent}
                  max={budget.allocated_cents}
                  color={cat?.color || "var(--pos)"}
                />
              </div>

              <div className="bud-envelope-row__status">
                {isOver ? (
                  <span className="bud-badge bud-badge--over">
                    <TriangleAlert size={13} /> over
                  </span>
                ) : budget.rolls_over ? (
                  <span className="bud-badge bud-badge--rollover">
                    <Repeat size={13} /> rolls over
                  </span>
                ) : (
                  <span className="bud-badge bud-badge--blank">—</span>
                )}
              </div>

              <div className="bud-envelope-row__right">
                <div className={`bud-envelope-row__amount${isOver ? " bud-envelope-row__amount--over" : ""}`}>
                  {formatCents(budget.allocated_cents)}
                </div>
                <div className="bud-envelope-row__meta figs">
                  {isOver
                    ? `–${formatCents(Math.abs(left))} over · ${formatCents(spent)} spent`
                    : `${formatCents(left)} left · ${formatCents(spent)} spent`}
                </div>
              </div>

              <button
                type="button"
                className="bud-envelope-row__delete"
                onClick={() => handleDeleteBudget(budget.id)}
                title="Delete envelope"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New category dialog */}
      <Dialog
        open={catDialogOpen}
        onClose={() => { setCatDialogOpen(false); setCatName(""); }}
        title="New category"
      >
        <form className="stacked-form" onSubmit={handleCreateCategory}>
          <TextField
            label="Name"
            type="text"
            placeholder="e.g. Groceries"
            value={catName}
            onChange={e => setCatName(e.target.value)}
          />

          <div>
            <label className="bud-ds-label">Type</label>
            <SegmentedControl
              ariaLabel="Category kind"
              value={catKind}
              onChange={setCatKind}
              options={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" },
              ]}
            />
          </div>

          <div>
            <label className="bud-ds-label">Color</label>
            <div className="bud-color-row">
              {CATEGORY_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`bud-color-btn${catColor === c ? " bud-color-btn--active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setCatColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="ds-dialog__footer">
            <Button type="button" variant="secondary" onClick={() => setCatDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create category</Button>
          </div>
        </form>
      </Dialog>

      {/* Add envelope dialog */}
      <Dialog
        open={budDialogOpen}
        onClose={() => { setBudDialogOpen(false); setBudCategoryId(""); setBudAmount(""); setBudNotes(""); }}
        title="Add envelope"
      >
        <form className="stacked-form" onSubmit={handleCreateBudget}>
          <Select
            label="Category"
            value={budCategoryId}
            onChange={e => setBudCategoryId(e.target.value)}
          >
            <option value="">
              {expenseCategories.length > 0 ? "Choose a category" : "No expense categories yet"}
            </option>
            {expenseCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>

          <TextField
            label="Monthly limit ($)"
            type="number"
            placeholder="e.g. 500"
            value={budAmount}
            onChange={e => setBudAmount(e.target.value)}
          />

          <TextField
            label="Notes (optional)"
            type="text"
            placeholder="Any notes"
            value={budNotes}
            onChange={e => setBudNotes(e.target.value)}
          />

          <div className="ds-dialog__footer">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { setBudDialogOpen(false); setBudCategoryId(""); setBudAmount(""); setBudNotes(""); }}
            >
              Cancel
            </Button>
            <Button type="submit">Create envelope</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Budget;
