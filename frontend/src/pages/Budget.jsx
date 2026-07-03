import { useEffect, useState } from "react";
import {
  createBudget,
  createCategory,
  deleteBudget,
  getBudgets,
  getCategories,
} from "../api/budgetApi";
import StatusMessage from "../components/StatusMessage";

function Budget() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [categoryKind, setCategoryKind] = useState("expense");
  const categoryIcon = "💰";

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [budgetMonth, setBudgetMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetNotes, setBudgetNotes] = useState("");

  const [selectedMonth, setSelectedMonth] = useState("");
  const [openMonth, setOpenMonth] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function getMonthKey(dateValue) {
    return String(dateValue).slice(0, 7);
  }

  function formatMonth(dateValue) {
    const [year, month] = getMonthKey(dateValue).split("-");

    return new Date(Number(year), Number(month) - 1).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  }

  async function loadBudgetData() {
    try {
      const categoriesData = await getCategories();
      const budgetsData = await getBudgets();

      if (categoriesData.error) {
        setError(categoriesData.error);
        return;
      }

      if (budgetsData.error) {
        setError(budgetsData.error);
        return;
      }

      const loadedCategories = categoriesData.data || [];
      const loadedBudgets = budgetsData.data || [];

      setCategories(loadedCategories);
      setBudgets(loadedBudgets);

      if (loadedBudgets.length > 0 && !selectedMonth) {
        const firstMonth = getMonthKey(loadedBudgets[0].period_month);
        setSelectedMonth(firstMonth);
      }
    } catch (err) {
      console.error("Failed to load budget data:", err);
      setError("Unable to load budget data.");
    }
  }

  useEffect(() => {
    loadBudgetData();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setError("Category name is required.");
      setMessage("");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await createCategory({
        name: categoryName,
        kind: categoryKind,
        icon: categoryIcon,
        color: categoryKind === "income" ? "#10b981" : "#8b5cf6",
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Category created successfully.");
      setCategoryName("");
      setCategoryKind("expense");

      await loadBudgetData();
    } catch (err) {
      console.error("Failed to create category:", err);
      setError("Unable to create category.");
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();

    if (!selectedCategoryId || !budgetMonth || !budgetAmount) {
      setError("Category, month, and amount are required.");
      setMessage("");
      return;
    }

    try {
      setError("");
      setMessage("");

      const data = await createBudget({
        categoryId: selectedCategoryId,
        periodMonth: budgetMonth,
        amountDollars: budgetAmount,
        notes: budgetNotes,
      });

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Budget created successfully.");
      setSelectedMonth(budgetMonth);
      setOpenMonth(budgetMonth);

      setSelectedCategoryId("");
      setBudgetMonth(new Date().toISOString().slice(0, 7));
      setBudgetAmount("");
      setBudgetNotes("");

      await loadBudgetData();
    } catch (err) {
      console.error("Failed to create budget:", err);
      setError("Unable to create budget.");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      setError("");
      setMessage("");

      const data = await deleteBudget(budgetId);

      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("Budget deleted successfully.");

      await loadBudgetData();
    } catch (err) {
      console.error("Failed to delete budget:", err);
      setError("Unable to delete budget.");
    }
  };

  const monthKeys = [
    ...new Set(budgets.map((budget) => getMonthKey(budget.period_month))),
  ];

  const visibleBudgets = budgets.filter(
    (budget) => getMonthKey(budget.period_month) === selectedMonth
  );

  return (
    <div className="dashboard-page">
      <div className="hero-title">
        <span className="sparkle">💰</span>
        <h1>Budget Management</h1>
      </div>

      <div className="transactions-card">
        <div className="section-header">
          <div className="card-icon small-icon">📋</div>
          <div className="section-header-text">
            <h2>Your Budgets</h2>
            <p className="section-subtitle">
              Create categories and monthly limits to stay on track.
            </p>
          </div>
        </div>

        <StatusMessage error={error} message={message} />

        <div className="budget-form-section">
          <h3 className="form-section-title">
            💸 Wondering where your money goes? 🤔
          </h3>

          <p className="form-section-subtitle">
            Let's find out 😉 Start by creating a category.
          </p>

          <form className="budget-form budget-form-triple" onSubmit={handleCreateCategory}>
            <input
              type="text"
              placeholder="Category Name, e.g. Food"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <select
              value={categoryKind}
              onChange={(e) => setCategoryKind(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <button type="submit">Add Category</button>
          </form>
        </div>

        <div className="budget-form-section">
          <h3 className="form-section-title">🧾 Give your money a game plan</h3>

          <p className="form-section-subtitle">
            💸 Pick a category, set a limit, and keep future-you thankful 😇
          </p>

          <form
            className="budget-form budget-form-wide"
            onSubmit={handleCreateBudget}
          >
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Choose a category</option>

              {categories
                .filter((category) => category.kind === "expense")
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    💰 {category.name}
                  </option>
                ))}
            </select>

            <input
              type="month"
              value={budgetMonth}
              onChange={(e) => setBudgetMonth(e.target.value)}
            />

            <input
              type="number"
              placeholder="Amount, e.g. 500"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
            />

            <input
              type="text"
              placeholder="Notes optional"
              value={budgetNotes}
              onChange={(e) => setBudgetNotes(e.target.value)}
            />

            <button type="submit">Create Budget</button>
          </form>
        </div>

        <div className="budget-list">
          {budgets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💵</div>
              <p>No budgets yet. Create one to start tracking your spending.</p>
            </div>
          ) : (
            <>
              <div className="budget-month-buttons">
                {monthKeys.map((monthKey) => (
                  <button
                    key={monthKey}
                    className={
                      openMonth === monthKey
                        ? "month-button active-month"
                        : "month-button"
                    }
                    onClick={() => {
                      setSelectedMonth(monthKey);
                      setOpenMonth(openMonth === monthKey ? "" : monthKey);
                    }}
                  >
                    View Budget for {formatMonth(`${monthKey}-01`)}
                  </button>
                ))}
              </div>

              {openMonth === selectedMonth &&
                visibleBudgets.map((budget) => {
                  const category = categories.find(
                    (cat) => cat.id === budget.category_id
                  );

                  return (
                    <div className="budget-card" key={budget.id}>
                      <div className="budget-card-icon">💰</div>

                      <div className="budget-card-text">
                        <h3>{category?.name || "Category"}</h3>
                        <p>{formatMonth(budget.period_month)}</p>
                      </div>

                      <div className="budget-card-actions">
                        <div className="budget-card-amount">
                          ${(budget.allocated_cents / 100).toFixed(2)}
                        </div>

                        <button
                          className="delete-budget-button"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Budget;