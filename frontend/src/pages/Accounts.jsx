import { useEffect, useState } from "react";
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
} from "../api/transactionApi";
import {
  Landmark,
  PiggyBank,
  CreditCard,
  Banknote,
  LineChart,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  PageHeader,
  Card,
  Button,
  TextField,
  Select,
  StatusBanner,
  EmptyState,
  Dialog,
} from "../design-system/components";
import { formatCents } from "../utils/moneyUtils";
import "./Accounts.css";

const ACCOUNT_TYPES = {
  checking: { label: "Checking", icon: Landmark },
  savings: { label: "Savings", icon: PiggyBank },
  credit_card: { label: "Credit card", icon: CreditCard },
  cash: { label: "Cash", icon: Banknote },
  investment: { label: "Investment", icon: LineChart },
};

function AccountCard({ account, onEdit, onDelete }) {
  const meta = ACCOUNT_TYPES[account.type] ?? ACCOUNT_TYPES.checking;
  const Icon = meta.icon;
  const isNegative = account.current_balance_cents < 0;

  return (
    <Card className="account-card">
      <div className="account-card__header">
        <div className="account-card__icon">
          <Icon />
        </div>

        <div className="account-card__header-right">
          <span className="account-card__type">{meta.label}</span>
          <div className="account-card__actions">
            <button
              type="button"
              className="account-card__action"
              onClick={() => onEdit(account)}
              title="Edit account"
              aria-label="Edit account"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              className="account-card__action account-card__action--delete"
              onClick={() => onDelete(account)}
              title="Remove account"
              aria-label="Remove account"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="account-card__name">{account.name}</div>
      <div className="account-card__meta">{account.currency}</div>

      <div
        className={
          isNegative
            ? "account-card__balance account-card__balance--negative"
            : "account-card__balance"
        }
      >
        {formatCents(account.current_balance_cents)}
      </div>
    </Card>
  );
}

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [startingBalance, setStartingBalance] = useState("");

  const [editingAccount, setEditingAccount] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("checking");

  const [deletingAccount, setDeletingAccount] = useState(null);

  async function loadAccounts() {
    try {
      setLoading(true);
      const data = await getAccounts();

      if (data.error) {
        setError(data.error);
        return;
      }

      setAccounts(data.data || []);
    } catch (err) {
      console.error("Failed to load accounts:", err);
      setError("Unable to load accounts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  const resetForm = () => {
    setName("");
    setType("checking");
    setStartingBalance("");
  };

  const closeDialog = () => {
    setShowForm(false);
    resetForm();
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Account name is required.");
      setMessage("");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await createAccount({
        name,
        type,
        startingBalanceDollars: startingBalance || 0,
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Account added successfully.");
      setShowForm(false);
      resetForm();

      await loadAccounts();
    } catch (err) {
      console.error("Failed to create account:", err);
      setError("Unable to create account.");
    }
  };

  const openEditDialog = (account) => {
    setEditingAccount(account);
    setEditName(account.name);
    setEditType(account.type);
  };

  const closeEditDialog = () => {
    setEditingAccount(null);
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      setError("Account name is required.");
      setMessage("");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await updateAccount(editingAccount.id, {
        name: editName,
        type: editType,
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Account updated successfully.");
      closeEditDialog();

      await loadAccounts();
    } catch (err) {
      console.error("Failed to update account:", err);
      setError("Unable to update account.");
    }
  };

  const openDeleteDialog = (account) => {
    setDeletingAccount(account);
  };

  const closeDeleteDialog = () => {
    setDeletingAccount(null);
  };

  const handleDeleteAccount = async () => {
    try {
      setError("");
      setMessage("");

      const data = await deleteAccount(deletingAccount.id);

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Account removed.");
      closeDeleteDialog();

      await loadAccounts();
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError("Unable to remove account.");
    }
  };

  const totalAssets = accounts
    .filter((account) => account.current_balance_cents > 0)
    .reduce((sum, account) => sum + account.current_balance_cents, 0);

  const totalLiabilities = accounts
    .filter((account) => account.current_balance_cents < 0)
    .reduce((sum, account) => sum + Math.abs(account.current_balance_cents), 0);

  const netWorth = totalAssets - totalLiabilities;
  const creditLineCount = accounts.filter(
    (account) => account.type === "credit_card"
  ).length;

  const subtitle = accounts.length
    ? `${accounts.length} account${accounts.length === 1 ? "" : "s"}${
        creditLineCount
          ? ` · ${creditLineCount} credit line${creditLineCount === 1 ? "" : "s"}`
          : ""
      }`
    : "No accounts yet";

  return (
    <div className="page">
      <PageHeader
        eyebrow="Ledger"
        title="Accounts"
        subtitle={subtitle}
        action={
          <Button icon={<Plus />} onClick={() => setShowForm((s) => !s)}>
            Add account
          </Button>
        }
      />

      <StatusBanner error={error} message={message} />

      <Dialog open={showForm} onClose={closeDialog} title="Add account">
        <form className="stacked-form" onSubmit={handleCreateAccount}>
          <TextField
            label="Account name"
            type="text"
            placeholder="e.g. Everyday Checking"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select
            label="Account type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {Object.entries(ACCOUNT_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <TextField
            label="Starting balance"
            type="number"
            placeholder="0.00"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
          />

          <div className="ds-dialog__footer">
            <Button type="button" variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit">Add account</Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={!!editingAccount}
        onClose={closeEditDialog}
        title="Edit account"
      >
        <form className="stacked-form" onSubmit={handleUpdateAccount}>
          <TextField
            label="Account name"
            type="text"
            placeholder="e.g. Everyday Checking"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <Select
            label="Account type"
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
          >
            {Object.entries(ACCOUNT_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

          <div className="ds-dialog__footer">
            <Button type="button" variant="secondary" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={!!deletingAccount}
        onClose={closeDeleteDialog}
        title="Remove account"
      >
        <div className="stacked-form">
          <p className="account-confirm-copy">
            Remove “{deletingAccount?.name}”? It will be archived and hidden
            from your accounts list, but its transaction history is kept.
          </p>

          <div className="ds-dialog__footer">
            <Button type="button" variant="secondary" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleDeleteAccount}>
              Remove account
            </Button>
          </div>
        </div>
      </Dialog>

      {!loading && accounts.length > 0 && (
        <Card elevated padding="30px 32px" className="accounts-hero">
          <div>
            <div className="accounts-hero__label">Net worth</div>
            <div className="accounts-hero__value">{formatCents(netWorth)}</div>
          </div>

          <div className="accounts-hero__breakdown">
            <div className="accounts-hero__stat">
              <div className="accounts-hero__stat-label">Assets</div>
              <div className="accounts-hero__stat-value">
                {formatCents(totalAssets)}
              </div>
            </div>

            <div className="accounts-hero__stat">
              <div className="accounts-hero__stat-label">Liabilities</div>
              <div className="accounts-hero__stat-value accounts-hero__stat-value--negative">
                {formatCents(-totalLiabilities)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <Card padding="40px" style={{ textAlign: "center", color: "var(--muted)" }}>
          Loading accounts…
        </Card>
      ) : accounts.length === 0 ? (
        <Card padding="28px 30px">
          <EmptyState
            icon={<Landmark />}
            action={
              <Button icon={<Plus />} onClick={() => setShowForm(true)}>
                Add account
              </Button>
            }
          >
            No accounts yet. Add one to start tracking your balances.
          </EmptyState>
        </Card>
      ) : (
        <div className="account-grid">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}

          <button
            type="button"
            className="ds-card account-card--placeholder"
            onClick={() => setShowForm(true)}
          >
            <Plus />
            Link an account
          </button>
        </div>
      )}
    </div>
  );
}

export default Accounts;
