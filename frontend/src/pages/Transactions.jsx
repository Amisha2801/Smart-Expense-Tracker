import { useEffect, useState, useCallback, useMemo } from "react";
import { getCategories } from "../api/budgetApi";
import {
  createAccount,
  createTransaction,
  deleteTransaction,
  getAccounts,
  getTransactions,
} from "../api/transactionApi";
import {
  Search, Plus, Landmark, PiggyBank, CreditCard, Banknote, LineChart,
  ArrowDownLeft, ArrowUpRight, ShoppingCart, Utensils, Car, House, Zap,
  Repeat, ShoppingBag, Clapperboard, Briefcase, Laptop, Gift, Tags, Trash2,
} from "lucide-react";
import {
  Button, Dialog, Select, TextField, SegmentedControl, StatusBanner, EmptyState, MonthYearPicker,
} from "../design-system/components";
import { formatCents, getCurrentMonthKey } from "../utils/moneyUtils";
import "./Transactions.css";

const ACCOUNT_ICONS = {
  checking: Landmark,
  savings: PiggyBank,
  credit_card: CreditCard,
  cash: Banknote,
  investment: LineChart,
};

function guessIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("grocer") || n.includes("market")) return ShoppingCart;
  if (n.includes("din") || n.includes("food") || n.includes("restaurant")) return Utensils;
  if (n.includes("trans") || n.includes("car") || n.includes("gas") || n.includes("fuel")) return Car;
  if (n.includes("hous") || n.includes("rent") || n.includes("home")) return House;
  if (n.includes("util")) return Zap;
  if (n.includes("sub") || n.includes("netflix") || n.includes("spotify")) return Repeat;
  if (n.includes("shop") || n.includes("amazon")) return ShoppingBag;
  if (n.includes("fun") || n.includes("entertain")) return Clapperboard;
  if (n.includes("salary") || n.includes("job")) return Briefcase;
  if (n.includes("freelance") || n.includes("side")) return Laptop;
  if (n.includes("gift") || n.includes("other")) return Gift;
  return Tags;
}

function txDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) {
    return `Today · ${d.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
  }
  if (d.toDateString() === yesterday.toDateString()) {
    return `Yesterday · ${d.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
  }
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [filterMonth, setFilterMonth] = useState(getCurrentMonthKey());
  const [filterAccountId, setFilterAccountId] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");

  // Add transaction dialog
  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const [txType, setTxType] = useState("expense");
  const [txAccountId, setTxAccountId] = useState("");
  const [txCategoryId, setTxCategoryId] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txDate, setTxDate] = useState(new Date().toISOString().slice(0, 10));
  const [txPayee, setTxPayee] = useState("");
  const [txNotes, setTxNotes] = useState("");

  // Add account dialog
  const [accDialogOpen, setAccDialogOpen] = useState(false);
  const [accName, setAccName] = useState("");
  const [accType, setAccType] = useState("checking");
  const [accBalance, setAccBalance] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [accData, catData, txData] = await Promise.all([
        getAccounts(),
        getCategories(),
        getTransactions(),
      ]);
      if (accData.error) { setError(accData.error); return; }
      if (catData.error) { setError(catData.error); return; }
      if (txData.error)  { setError(txData.error);  return; }
      setAccounts(accData.data || []);
      setCategories(catData.data || []);
      setTransactions(txData.data || []);
    } catch {
      setError("Unable to load transaction data.");
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    if (!txAccountId || !txCategoryId || !txAmount || !txDate) {
      setError("Account, category, amount, and date are required.");
      return;
    }
    try {
      setError(""); setMessage("");
      const data = await createTransaction({
        accountId: txAccountId,
        categoryId: txCategoryId,
        type: txType,
        amountDollars: txAmount,
        occurredOn: txDate,
        payee: txPayee,
        notes: txNotes,
      });
      if (data.error) { setError(data.error); return; }
      setMessage(`${txType === "income" ? "Income" : "Expense"} added.`);
      setTxAmount(""); setTxPayee(""); setTxNotes(""); setTxAccountId(""); setTxCategoryId("");
      setTxDate(new Date().toISOString().slice(0, 10));
      setTxDialogOpen(false);
      await loadData();
    } catch {
      setError("Unable to create transaction.");
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!accName.trim()) { setError("Account name is required."); return; }
    try {
      setError(""); setMessage("");
      const data = await createAccount({
        name: accName,
        type: accType,
        startingBalanceDollars: accBalance || 0,
      });
      if (data.error) { setError(data.error); return; }
      setMessage("Account created.");
      setAccName(""); setAccType("checking"); setAccBalance("");
      setAccDialogOpen(false);
      await loadData();
    } catch {
      setError("Unable to create account.");
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      setError(""); setMessage("");
      const data = await deleteTransaction(id);
      if (data.error) { setError(data.error); return; }
      setMessage("Transaction deleted.");
      await loadData();
    } catch {
      setError("Unable to delete transaction.");
    }
  };

  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter(tx => {
        if (filterMonth && tx.occurred_on?.slice(0, 7) !== filterMonth) return false;
        if (filterAccountId && String(tx.account_id) !== filterAccountId) return false;
        if (filterCategoryId && String(tx.category_id) !== filterCategoryId) return false;
        if (search) {
          const q = search.toLowerCase();
          const payeeMatch = (tx.payee || "").toLowerCase().includes(q);
          const cat = categories.find(c => c.id === tx.category_id);
          const catMatch = (cat?.name || "").toLowerCase().includes(q);
          if (!payeeMatch && !catMatch) return false;
        }
        return true;
      })
      .sort((a, b) => (b.occurred_on ?? "").localeCompare(a.occurred_on ?? ""));
  }, [transactions, filterMonth, filterAccountId, filterCategoryId, search, categories]);

  const totalIn = filteredTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount_cents, 0);

  const totalOut = filteredTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount_cents, 0);

  // Group by date
  const grouped = filteredTransactions.reduce((acc, tx) => {
    const key = tx.occurred_on ?? "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(tx);
    return acc;
  }, {});

  const txCategoryOptions = categories.filter(c => c.kind === txType);

  const monthLabel = filterMonth
    ? new Date(filterMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "All time";

  return (
    <div className="page trx-page">
      {/* Header */}
      <header className="trx-header">
        <div>
          <h1>Transactions</h1>
          <div className="trx-header__sub">All accounts · {monthLabel}</div>
        </div>
        <div className="trx-header__actions">
          <Button variant="secondary" size="sm" onClick={() => { setError(""); setAccDialogOpen(true); }}>
            Add account
          </Button>
          <Button icon={<Plus size={16} />} onClick={() => { setError(""); setTxDialogOpen(true); }}>
            Log expense
          </Button>
        </div>
      </header>

      <StatusBanner error={error} message={message} />

      {/* Filter bar */}
      <div className="trx-filters">
        <div className="trx-search">
          <Search size={15} className="trx-search__icon" />
          <input
            className="trx-search__input"
            type="text"
            placeholder="Search payee or note"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <MonthYearPicker
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
        />

        <Select
          value={filterAccountId}
          onChange={e => setFilterAccountId(e.target.value)}
        >
          <option value="">All accounts</option>
          {accounts.map(acc => (
            <option key={acc.id} value={String(acc.id)}>{acc.name}</option>
          ))}
        </Select>

        <Select
          value={filterCategoryId}
          onChange={e => setFilterCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
          ))}
        </Select>

        <div className="trx-totals">
          <span>
            In <strong className="trx-total-pos figs">{formatCents(totalIn)}</strong>
          </span>
          <span>
            Out <strong className="trx-total-neg figs">{formatCents(totalOut)}</strong>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="trx-table-wrap">
        {filteredTransactions.length === 0 ? (
          <EmptyState icon={<ArrowDownLeft />}>
            {transactions.length === 0
              ? "No transactions yet. Log one to get started."
              : "No transactions match your filters."}
          </EmptyState>
        ) : (
          <div className="trx-table">
            {/* Table header */}
            <div className="trx-table-head">
              <span>Payee</span>
              <span>Category</span>
              <span>Account</span>
              <span>Status</span>
              <span className="trx-col-right">Amount</span>
            </div>

            {/* Date groups */}
            {Object.entries(grouped).map(([date, txs]) => (
              <div key={date}>
                <div className="trx-date-group">{txDateLabel(date)}</div>
                {txs.map(tx => {
                  const cat = categories.find(c => c.id === tx.category_id);
                  const acc = accounts.find(a => a.id === tx.account_id);
                  const isIncome = tx.type === "income";
                  const Icon = guessIcon(cat?.name);

                  return (
                    <div key={tx.id} className="trx-row">
                      {/* Payee */}
                      <div className="trx-row__payee">
                        <span
                          className="trx-row__icon"
                          style={{
                            background: isIncome ? "var(--posbg)" : "var(--surface2)",
                            color: cat?.color || (isIncome ? "var(--pos)" : "var(--ink2)"),
                          }}
                        >
                          {isIncome ? <ArrowDownLeft size={16} /> : <Icon size={16} />}
                        </span>
                        <span className="trx-row__payee-name">
                          {tx.payee || cat?.name || (isIncome ? "Income" : "Expense")}
                        </span>
                      </div>

                      {/* Category */}
                      <div className="trx-row__category">
                        <span
                          className="trx-row__cat-dot"
                          style={{ background: cat?.color || "var(--muted)" }}
                        />
                        {cat?.name || "—"}
                      </div>

                      {/* Account */}
                      <div className="trx-row__account">{acc?.name || "—"}</div>

                      {/* Status badge */}
                      <div>
                        <span
                          className={`trx-badge ${tx.is_cleared ? "trx-badge--cleared" : "trx-badge--pending"}`}
                        >
                          {tx.is_cleared ? "Cleared" : "Pending"}
                        </span>
                      </div>

                      {/* Amount + delete */}
                      <div className="trx-row__amount-cell">
                        <span
                          className="figs trx-row__amount"
                          style={{ color: isIncome ? "var(--pos)" : "inherit", fontWeight: 600 }}
                        >
                          {isIncome ? "+" : "–"}
                          {formatCents(tx.amount_cents)}
                        </span>
                        <button
                          type="button"
                          className="trx-row__delete"
                          onClick={() => handleDeleteTransaction(tx.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add transaction dialog */}
      <Dialog
        open={txDialogOpen}
        onClose={() => { setTxDialogOpen(false); setTxAmount(""); setTxPayee(""); setTxNotes(""); setTxAccountId(""); setTxCategoryId(""); setTxDate(new Date().toISOString().slice(0, 10)); setTxType("expense"); }}
        title="Log a transaction"
      >
        <form className="stacked-form" onSubmit={handleCreateTransaction}>
          <SegmentedControl
            ariaLabel="Transaction type"
            value={txType}
            onChange={v => { setTxType(v); setTxCategoryId(""); }}
            options={[
              { value: "expense", label: "Expense" },
              { value: "income", label: "Income" },
            ]}
          />

          <div className="form-grid">
            <TextField
              label="Amount ($)"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={txAmount}
              onChange={e => setTxAmount(e.target.value)}
            />
            <TextField
              label="Date"
              type="date"
              value={txDate}
              onChange={e => setTxDate(e.target.value)}
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
            <Select
              label="Category"
              value={txCategoryId}
              onChange={e => setTxCategoryId(e.target.value)}
            >
              <option value="">
                {txCategoryOptions.length > 0 ? "Choose category" : `No ${txType} categories`}
              </option>
              {txCategoryOptions.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
          </div>

          <TextField
            label="Payee"
            type="text"
            placeholder="e.g. Tim Hortons"
            value={txPayee}
            onChange={e => setTxPayee(e.target.value)}
          />

          <TextField
            label="Notes (optional)"
            type="text"
            placeholder="Any notes"
            value={txNotes}
            onChange={e => setTxNotes(e.target.value)}
          />

          <div className="ds-dialog__footer">
            <Button type="button" variant="secondary" onClick={() => setTxDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {txType === "income" ? "Add income" : "Add expense"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Add account dialog */}
      <Dialog
        open={accDialogOpen}
        onClose={() => { setAccDialogOpen(false); setAccName(""); setAccBalance(""); }}
        title="Add account"
      >
        <form className="stacked-form" onSubmit={handleCreateAccount}>
          <TextField
            label="Account name"
            type="text"
            placeholder="e.g. Everyday Checking"
            value={accName}
            onChange={e => setAccName(e.target.value)}
          />
          <Select
            label="Account type"
            value={accType}
            onChange={e => setAccType(e.target.value)}
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit_card">Credit card</option>
            <option value="cash">Cash</option>
            <option value="investment">Investment</option>
          </Select>
          <TextField
            label="Starting balance ($)"
            type="number"
            placeholder="0.00"
            value={accBalance}
            onChange={e => setAccBalance(e.target.value)}
          />
          <div className="ds-dialog__footer">
            <Button type="button" variant="secondary" onClick={() => setAccDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add account</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Transactions;
