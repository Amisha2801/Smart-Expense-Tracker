import { useEffect, useState } from "react";
import { getCategories } from "../api/budgetApi";
import {
  createAccount,
  createTransaction,
  deleteTransaction,
  getAccounts,
  getTransactions,
} from "../api/transactionApi";
import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import {
  PageHeader,
  Card,
  SectionHeader,
  StatusBanner,
  TextField,
  Select,
  Button,
  SegmentedControl,
  EmptyState,
} from "../design-system/components";

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
    <div className="page">
      <PageHeader eyebrow="Ledger" title="Transactions" />

      <Card padding="28px 30px">
        <SectionHeader
          icon={<ArrowUpRight />}
          title="Track your spending"
          subtitle="Add accounts, expenses, and income to keep your ledger up to date."
        />

        <StatusBanner error={error} message={message} />

        <div className="form-section">
          <h3>Where does your money live?</h3>
          <p className="form-section-subtitle">
            Start by adding an account before tracking expenses.
          </p>

          <form className="form-grid form-grid--triple" onSubmit={handleCreateAccount}>
            <TextField
              type="text"
              placeholder="Account name, e.g. Checking"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />

            <TextField
              type="number"
              placeholder="Balance"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
            />

            <Button type="submit">Add account</Button>
          </form>
        </div>

        <div className="form-section">
          <h3>Where did today&rsquo;s money go &mdash; or come from?</h3>
          <p className="form-section-subtitle">
            Log an expense or income to keep your ledger up to date.
          </p>

          <div style={{ marginBottom: "var(--space-9)" }}>
            <SegmentedControl
              ariaLabel="Transaction type"
              value={transactionType}
              onChange={(value) => {
                setTransactionType(value);
                setSelectedCategoryId("");
              }}
              options={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" },
              ]}
            />
          </div>

          <form
            className="form-grid form-grid--wide"
            onSubmit={handleCreateTransaction}
          >
            <Select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="">Choose account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>

            <Select
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
                  {category.name}
                </option>
              ))}
            </Select>

            <TextField
              type="number"
              placeholder="Amount, e.g. 24.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <TextField
              type="date"
              value={occurredOn}
              onChange={(e) => setOccurredOn(e.target.value)}
            />

            <TextField
              type="text"
              placeholder="Payee, e.g. Tim Hortons"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
            />

            <TextField
              type="text"
              placeholder="Notes optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <Button type="submit">
              {transactionType === "income" ? "Add income" : "Add expense"}
            </Button>
          </form>
        </div>

        <div className="list">
          {transactions.length === 0 ? (
            <EmptyState icon={<ArrowDownLeft />}>
              No transactions yet. Add an expense to get started.
            </EmptyState>
          ) : (
            transactions.map((transaction) => {
              const category = categories.find(
                (cat) => cat.id === transaction.category_id
              );
              const isIncome = transaction.type === "income";
              const amountValue = (transaction.amount_cents / 100).toFixed(2);

              return (
                <div className="list-row" key={transaction.id}>
                  <div className="list-row__icon">
                    {isIncome ? <ArrowDownLeft /> : <ArrowUpRight />}
                  </div>

                  <div className="list-row__text">
                    <h3>
                      {transaction.payee ||
                        category?.name ||
                        (isIncome ? "Income" : "Expense")}
                    </h3>
                    <p>
                      {category?.name || "Category"} &middot;{" "}
                      {formatDate(transaction.occurred_on)}
                    </p>
                  </div>

                  <div className="list-row__actions">
                    <div
                      className={
                        isIncome
                          ? "list-row__amount list-row__amount--positive"
                          : "list-row__amount list-row__amount--negative"
                      }
                    >
                      {isIncome ? "+" : "–"}${amountValue}
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      icon={<Trash2 />}
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

export default Transactions;
