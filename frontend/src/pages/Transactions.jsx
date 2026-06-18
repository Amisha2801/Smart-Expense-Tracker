import { useEffect, useState } from "react";
import { getCategories } from "../api/budgetApi";
import {
  createAccount,
  createTransaction,
  deleteTransaction,
  getAccounts,
  getTransactions,
} from "../api/transactionApi";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [accountName, setAccountName] = useState("");
  const [startingBalance, setStartingBalance] = useState("");

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredOn, setOccurredOn] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [payee, setPayee] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTransactionData() {
    try {
      const accountsData = await getAccounts();
      const categoriesData = await getCategories();
      const transactionsData = await getTransactions();

      if (accountsData.error) {
        setError(accountsData.error);
        return;
      }

      if (categoriesData.error) {
        setError(categoriesData.error);
        return;
      }

      if (transactionsData.error) {
        setError(transactionsData.error);
        return;
      }

      setAccounts(accountsData.data || []);
      setCategories(categoriesData.data || []);
      setTransactions(transactionsData.data || []);
    } catch (err) {
      console.error("Failed to load transaction data:", err);
      setError("Unable to load transaction data.");
    }
  }

  useEffect(() => {
    loadTransactionData();
  }, []);

  function formatDate(dateValue) {
    return new Date(dateValue).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!accountName.trim()) {
      setError("Account name is required.");
      setMessage("");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await createAccount({
        name: accountName,
        type: "checking",
        startingBalanceDollars: startingBalance || 0,
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Account created successfully.");
      setAccountName("");
      setStartingBalance("");

      await loadTransactionData();
    } catch (err) {
      console.error("Failed to create account:", err);
      setError("Unable to create account.");
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();

    if (!selectedAccountId || !selectedCategoryId || !amount || !occurredOn) {
      setError("Account, category, amount, and date are required.");
      setMessage("");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await createTransaction({
        accountId: selectedAccountId,
        categoryId: selectedCategoryId,
        type: "expense",
        amountDollars: amount,
        occurredOn,
        payee,
        notes,
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Transaction created successfully.");
      setSelectedAccountId("");
      setSelectedCategoryId("");
      setAmount("");
      setOccurredOn(new Date().toISOString().slice(0, 10));
      setPayee("");
      setNotes("");

      await loadTransactionData();
    } catch (err) {
      console.error("Failed to create transaction:", err);
      setError("Unable to create transaction.");
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      setError("");
      setMessage("");

      const data = await deleteTransaction(transactionId);

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Transaction deleted successfully.");

      await loadTransactionData();
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      setError("Unable to delete transaction.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="hero-title">
        <span className="sparkle">💳</span>
        <h1>Transactions</h1>
      </div>

      <div className="transactions-card">
        <div className="transactions-header">
          <div className="card-icon small-icon">💸</div>
          <h2>Track Your Spending</h2>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <div className="budget-form-section">
          <h3>🏦 First, add an account</h3>

          <p className="budget-subtitle">
            Add where your money is coming from before tracking expenses.
          </p>

          <form className="budget-form" onSubmit={handleCreateAccount}>
            <input
              type="text"
              placeholder="Account Name, e.g. Checking"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Starting Balance"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
            />

            <button type="submit">Add Account</button>
          </form>
        </div>

        <div className="budget-form-section">
          <h3>🧾 Add an expense</h3>

          <p className="budget-subtitle">
            Log where your money went so your budget stays honest.
          </p>

          <form
            className="budget-form budget-form-wide"
            onSubmit={handleCreateTransaction}
          >
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="">Choose account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Choose category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  💰 {category.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount, e.g. 24.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="date"
              value={occurredOn}
              onChange={(e) => setOccurredOn(e.target.value)}
            />

            <input
              type="text"
              placeholder="Payee, e.g. Tim Hortons"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
            />

            <input
              type="text"
              placeholder="Notes optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button type="submit">Add Expense</button>
          </form>
        </div>

        <div className="budget-list">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧾</div>
              <p>No transactions yet. Add an expense to get started.</p>
            </div>
          ) : (
            transactions.map((transaction) => {
              const category = categories.find(
                (cat) => cat.id === transaction.category_id
              );

              return (
                <div className="budget-card" key={transaction.id}>
                  <div className="budget-card-icon">💳</div>

                  <div>
                    <h3>{transaction.payee || category?.name || "Expense"}</h3>
                    <p>
                      {category?.name || "Category"} •{" "}
                      {formatDate(transaction.occurred_on)}
                    </p>
                  </div>

                  <div className="budget-card-actions">
                    <div className="budget-card-amount">
                      ${(transaction.amount_cents / 100).toFixed(2)}
                    </div>

                    <button
                      className="delete-budget-button"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;