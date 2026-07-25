import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft, ArrowUpRight, Wallet, ChevronRight, Plus,
  Landmark, PiggyBank, CreditCard, Banknote, LineChart,
} from "lucide-react";
import { getTransactions, createTransaction, getAccounts } from "../api/transactionApi";
import { getBudgets, getCategories } from "../api/budgetApi";
import {
  Button, Dialog, TextField, Select, SegmentedControl, StatusBanner,
} from "../design-system/components";
import { formatCents, getCurrentMonthKey } from "../utils/moneyUtils";
import "./Dashboard.css";

const ACCOUNT_ICONS = {
  checking: Landmark,
  savings: PiggyBank,
  credit_card: CreditCard,
  cash: Banknote,
  investment: LineChart,
};

function greetingFor() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function txDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function getUserName() {
  const savedName = localStorage.getItem("userName");

  if (savedName) {
    return savedName;
  }

  return "there";
}

function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [logOpen, setLogOpen] = useState(false);
  const [txType, setTxType] = useState("expense");
  const [txAmount, setTxAmount] = useState("");
  const [txAccountId, setTxAccountId] = useState("");
  const [txCategoryId, setTxCategoryId] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 10));
  const [txPayee, setTxPayee] = useState("");
  const [txError, setTxError] = useState("");
  const [txMessage, setTxMessage] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [txData, accData, budData, catData] = await Promise.all([
        getTransactions(),
        getAccounts(),
        getBudgets(),
        getCategories(),
      ]);
      setTransactions(txData.data || []);
      setAccounts(accData.data || []);
      setBudgets(budData.data || []);
      setCategories(catData.data || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const monthKey = getCurrentMonthKey();

  const monthTransactions = transactions.filter(
    tx => tx.occurred_on?.slice(0, 7) === monthKey
  );

  const totalIncome = monthTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount_cents, 0);

  const totalSpent = monthTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount_cents, 0);

  const netWorth = accounts.reduce((sum, acc) => sum + acc.current_balance_cents, 0);

  const monthBudgets = budgets.filter(b => b.period_month?.slice(0, 7) === monthKey);
  const totalAllocated = monthBudgets.reduce((sum, b) => sum + b.allocated_cents, 0);
  const safeToSpend = totalAllocated - totalSpent;
  const spentPct = totalAllocated > 0
    ? Math.min(100, Math.round((totalSpent / totalAllocated) * 100))
    : 0;
  const isOverBudget = safeToSpend < 0;

  const envelopes = monthBudgets.map(budget => {
    const cat = categories.find(c => c.id === budget.category_id);
    const spent = monthTransactions
      .filter(tx => tx.category_id === budget.category_id && tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount_cents, 0);
    const pct = budget.allocated_cents > 0
      ? Math.min(100, Math.round((spent / budget.allocated_cents) * 100))
      : 0;
    return { budget, cat, spent, pct, isOver: spent > budget.allocated_cents };
  });

  const recentTransactions = [...transactions]
    .sort((a, b) => (b.occurred_on ?? "").localeCompare(a.occurred_on ?? ""))
    .slice(0, 5);

  const groupedRecent = recentTransactions.reduce((acc, tx) => {
    const key = tx.occurred_on ?? "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});

  const handleLogExpense = async (e) => {
    e.preventDefault();
    if (!txAmount || !txAccountId || !txCategoryId) {
      setTxError("Amount, account, and category are required.");
      return;
    }
    try {
      setTxError(""); setTxMessage("");
      const data = await createTransaction({
        accountId: txAccountId,
        categoryId: txCategoryId,
        type: txType,
        amountDollars: txAmount,
        occurredOn: txDate,
        payee: txPayee,
        notes: "",
      });
      if (data.error) { setTxError(data.error); return; }
      setTxMessage("Transaction saved!");
      setTxAmount(""); setTxPayee(""); setTxAccountId(""); setTxCategoryId("");
      setTxDate(new Date().toISOString().slice(0, 10));
      setTimeout(() => { setLogOpen(false); setTxMessage(""); }, 900);
      await loadData();
    } catch {
      setTxError("Unable to save transaction.");
    }
  };

  const closeLogDialog = () => {
    setLogOpen(false);
    setTxAmount(""); setTxPayee(""); setTxAccountId(""); setTxCategoryId("");
    setTxDate(new Date().toISOString().slice(0, 10));
    setTxType("expense");
    setTxError(""); setTxMessage("");
  };

  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: 60, color: "var(--muted)" }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="page dash-page">
      {/* Header */}
      <header className="dash-header">
        <div>
          <div className="dash-header__eyebrow">{todayLabel()}</div>
          <h1 className="dash-header__title">{greetingFor()}, {getUserName()}</h1>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setLogOpen(true)}>
          Log expense
        </Button>
      </header>

      {/* Safe to spend hero */}
      <div className="dash-hero">
        <div className="dash-hero__left">
          <div className="dash-hero__label">Safe to spend this month</div>
          <div
            className="dash-hero__amount figs"
            style={{ color: isOverBudget ? "var(--neg)" : "inherit" }}
          >
            {isOverBudget ? "–" : ""}
            {formatCents(Math.abs(safeToSpend))}
          </div>
          {totalAllocated > 0 && (
            <div className="dash-hero__meta">
              of{" "}
              <strong>{formatCents(totalAllocated)}</strong> budgeted across{" "}
              {monthBudgets.length} envelope{monthBudgets.length !== 1 ? "s" : ""}{" "}·{" "}
              <span style={{ color: isOverBudget ? "var(--neg)" : "var(--pos)", fontWeight: 600 }}>
                {isOverBudget ? "over budget" : "on track"}
              </span>
            </div>
          )}
          {totalAllocated === 0 && (
            <div className="dash-hero__meta">
              <span
                style={{ color: "var(--ink2)", cursor: "pointer" }}
                onClick={() => navigate("/budget")}
              >
                Set up a budget to track your spending →
              </span>
            </div>
          )}
        </div>
        <div
          className="dash-donut"
          style={{
            background: `conic-gradient(${isOverBudget ? "var(--neg)" : "var(--pos)"} 0 ${spentPct}%, var(--track) ${spentPct}% 100%)`,
          }}
        >
          <div className="dash-donut__inner">
            <div className="dash-donut__pct figs">{spentPct}%</div>
            <div className="dash-donut__sub">spent</div>
          </div>
        </div>
      </div>

      {/* 3 stat cards */}
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat__label" style={{ color: "var(--pos)" }}>
            <ArrowDownLeft size={15} />
            Income
          </div>
          <div className="dash-stat__value figs">{formatCents(totalIncome)}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label" style={{ color: "var(--neg)" }}>
            <ArrowUpRight size={15} />
            Spent
          </div>
          <div className="dash-stat__value figs">{formatCents(totalSpent)}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat__label" style={{ color: "var(--ink2)" }}>
            <Wallet size={15} />
            Net worth
          </div>
          <div className="dash-stat__value figs">{formatCents(netWorth)}</div>
        </div>
      </div>

      {/* Envelopes + Accounts */}
      <div className="dash-two-col">
        <section>
          <div className="dash-section-header">
            <h2>This month&apos;s envelopes</h2>
            <span className="dash-section-header__meta">spent / budget</span>
          </div>
          {envelopes.length === 0 ? (
            <p className="dash-empty-hint">
              No budgets set for this month.{" "}
              <button type="button" className="dash-link" onClick={() => navigate("/budget")}>
                Set one up →
              </button>
            </p>
          ) : (
            <div className="dash-envelopes">
              {envelopes.map(({ budget, cat, spent, pct, isOver }) => (
                <div key={budget.id} className="dash-envelope">
                  <div className="dash-envelope__header">
                    <span className="dash-envelope__name">
                      <span
                        className="dash-envelope__dot"
                        style={{ background: cat?.color || "var(--muted)" }}
                      />
                      {cat?.name || "Uncategorized"}
                    </span>
                    <span
                      className="dash-envelope__amounts figs"
                      style={{ color: isOver ? "var(--neg)" : "var(--ink2)" }}
                    >
                      {formatCents(spent)} / {formatCents(budget.allocated_cents)}
                    </span>
                  </div>
                  <div className="dash-envelope__track">
                    <div
                      className="dash-envelope__fill"
                      style={{
                        width: `${pct}%`,
                        background: isOver ? "var(--neg)" : (cat?.color || "var(--pos)"),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="dash-section-header">
            <h2>Accounts</h2>
          </div>
          {accounts.length === 0 ? (
            <p className="dash-empty-hint">
              No accounts yet.{" "}
              <button type="button" className="dash-link" onClick={() => navigate("/accounts")}>
                Add one →
              </button>
            </p>
          ) : (
            <div className="dash-accounts-list">
              {accounts.map(acc => {
                const Icon = ACCOUNT_ICONS[acc.type] ?? Landmark;
                const isNeg = acc.current_balance_cents < 0;
                return (
                  <div key={acc.id} className="dash-account-row">
                    <span className="dash-account-row__name">
                      <Icon size={16} style={{ color: "var(--muted)" }} />
                      {acc.name}
                    </span>
                    <span
                      className="dash-account-row__bal figs"
                      style={{ color: isNeg ? "var(--neg)" : "inherit" }}
                    >
                      {isNeg && "–"}
                      {formatCents(Math.abs(acc.current_balance_cents))}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Recent transactions */}
      <section className="dash-recent">
        <div className="dash-section-header">
          <h2>Recent transactions</h2>
          <button
            type="button"
            className="dash-section-header__link"
            onClick={() => navigate("/transactions")}
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="dash-tx-list">
          {recentTransactions.length === 0 ? (
            <p className="dash-empty-hint">No transactions yet.</p>
          ) : (
            Object.entries(groupedRecent).map(([date, txs]) => (
              <div key={date}>
                <div className="dash-tx-date-header">{txDateLabel(date)}</div>
                {txs.map(tx => {
                  const cat = categories.find(c => c.id === tx.category_id);
                  const acc = accounts.find(a => a.id === tx.account_id);
                  const isIncome = tx.type === "income";
                  return (
                    <div key={tx.id} className="dash-tx-row">
                      <div className="dash-tx-row__left">
                        <span
                          className="dash-tx-dot"
                          style={{ background: cat?.color || "var(--muted)" }}
                        />
                        <div>
                          <div className="dash-tx-row__payee">
                            {tx.payee || cat?.name || (isIncome ? "Income" : "Expense")}
                          </div>
                          <div className="dash-tx-row__meta">
                            {cat?.name || "—"} · {acc?.name || "—"}
                          </div>
                        </div>
                      </div>
                      <span
                        className="dash-tx-row__amount figs"
                        style={{ color: isIncome ? "var(--pos)" : "inherit", fontWeight: 600 }}
                      >
                        {isIncome ? "+" : "–"}
                        {formatCents(tx.amount_cents)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Log Expense Dialog */}
      <Dialog open={logOpen} onClose={closeLogDialog} title="Log a transaction">
        <form className="stacked-form" onSubmit={handleLogExpense}>
          <SegmentedControl
            ariaLabel="Transaction type"
            value={txType}
            onChange={v => { setTxType(v); setTxCategoryId(""); }}
            options={[
              { value: "expense", label: "Expense" },
              { value: "income", label: "Income" },
            ]}
          />

          <div className="dash-log-amount">
            <span className="dash-log-amount__currency figs">$</span>
            <input
              className="dash-log-amount__input figs"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={txAmount}
              onChange={e => setTxAmount(e.target.value)}
            />
          </div>

          <div className="form-grid">
            <Select
              label="Account"
              value={txAccountId}
              onChange={e => setTxAccountId(e.target.value)}
            >
              <option value="">Choose account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </Select>
            <TextField
              label="Date"
              type="date"
              value={txDate}
              onChange={e => setTxDate(e.target.value)}
            />
          </div>

          <Select
            label="Category"
            value={txCategoryId}
            onChange={e => setTxCategoryId(e.target.value)}
          >
            <option value="">Choose category</option>
            {categories.filter(c => c.kind === txType).map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>

          <TextField
            label="Payee"
            type="text"
            placeholder="e.g. Whole Foods Market"
            value={txPayee}
            onChange={e => setTxPayee(e.target.value)}
          />

          <StatusBanner error={txError} message={txMessage} />

          <div className="ds-dialog__footer">
            <Button type="button" variant="secondary" onClick={closeLogDialog}>
              Cancel
            </Button>
            <Button type="submit">Save transaction</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Dashboard;
