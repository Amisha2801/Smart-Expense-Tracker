import { useEffect, useState } from "react";
import { getCategories } from "../api/budgetApi";
import {
  createAccount,
  createTransaction,
  deleteTransaction,
  getAccounts,
  getTransactions,
} from "../api/transactionApi";
import StatusMessage from "../components/StatusMessage";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [accountName, setAccountName] = useState("");
  const [startingBalance, setStartingBalance] = useState("");

  const [transactionType, setTransactionType] = useState("expense");
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
        type: transactionType,
        amountDollars: amount,
        occurredOn,
        payee,
        notes,
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage(
        transactionType === "income"
          ? "Income added successfully."
          : "Expense added successfully."
      );
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

  const categoryOptions = categories.filter(
    (category) => category.kind === transactionType
  );

  return (
    <div className="dashboard-page">
      <div className="hero-title">
        <span className="sparkle">💳</span>
        <h1>Transactions</h1>
      </div>

      <div className="transactions-card">
        <div className="section-header">
          <div className="card-icon small-icon">💸</div>
          <div className="section-header-text">
            <h2>Track Your Spending</h2>
            <p className="section-subtitle">
              Add accounts, expenses, and income to keep your ledger up to date.
            </p>
          </div>
        </div>

        <StatusMessage error={error} message={message} />

        <div className="budget-form-section">
          <h3 className="form-section-title">🏦 Where does your money live?</h3>

          <p className="form-section-subtitle">
            Let's start by adding an account before tracking expenses.
          </p>

          <form className="budget-form budget-form-triple" onSubmit={handleCreateAccount}>
            <input
              type="text"
              placeholder="Account Name, e.g. Checking"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Balance"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
            />

            <button type="submit">Add Account</button>
          </form>
        </div>

        <div className="budget-form-section">
          <h3 className="form-section-title">
            💸 Where did today's money go — or come from?
          </h3>

          <p className="form-section-subtitle">
            Log an expense or income to keep your ledger up to date 😅
          </p>

          <div className="type-toggle" role="group" aria-label="Transaction type">
            <button
              type="button"
              className={
                transactionType === "expense"
                  ? "type-toggle-option active"
                  : "type-toggle-option"
              }
              onClick={() => {
                setTransactionType("expense");
                setSelectedCategoryId("");
              }}
            >
              💳 Expense
            </button>
            <button
              type="button"
              className={
                transactionType === "income"
                  ? "type-toggle-option active income"
                  : "type-toggle-option"
              }
              onClick={() => {
                setTransactionType("income");
                setSelectedCategoryId("");
              }}
            >
              💵 Income
            </button>
          </div>

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
              <option value="">
                {categoryOptions.length > 0
                  ? "Choose category"
                  : `No ${transactionType} categories yet`}
              </option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {transactionType === "income" ? "💵" : "💰"} {category.name}
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

            <button type="submit">
              {transactionType === "income" ? "Add Income" : "Add Expense"}
            </button>
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
              const isIncome = transaction.type === "income";
              const amount = (transaction.amount_cents / 100).toFixed(2);

              return (
                <div className="budget-card" key={transaction.id}>
                  <div className="budget-card-icon">
                    {isIncome ? "💵" : "💳"}
                  </div>

                  <div className="budget-card-text">
                    <h3>
                      {transaction.payee ||
                        category?.name ||
                        (isIncome ? "Income" : "Expense")}
                    </h3>
                    <p>
                      {category?.name || "Category"} •{" "}
                      {formatDate(transaction.occurred_on)}
                    </p>
                  </div>

                  <div className="budget-card-actions">
                    <div
                      className={
                        isIncome
                          ? "budget-card-amount income"
                          : "budget-card-amount"
                      }
                    >
                      {isIncome ? "+" : "-"}${amount}
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