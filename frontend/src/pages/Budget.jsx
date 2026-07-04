import { useEffect, useState } from "react";
import {
  createBudget,
  createCategory,
  deleteBudget,
  getBudgets,
  getCategories,
} from "../api/budgetApi";
import { PiggyBank, Tag } from "lucide-react";
import {
  PageHeader,
  Card,
  SectionHeader,
  StatusBanner,
  TextField,
  Select,
  Button,
  EmptyState,
} from "../design-system/components";

const CATEGORY_COLORS = {
  income: "#3f6f4f",
  expense: "#c26a3d",
};

function Budget() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [categoryKind, setCategoryKind] = useState("expense");

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
        icon: "💰",
        color: CATEGORY_COLORS[categoryKind],
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
    <div className="page">
      <PageHeader eyebrow="Ledger" title="Budget" />

      <Card padding="28px 30px">
        <SectionHeader
          icon={<PiggyBank />}
          title="Your budgets"
          subtitle="Create categories and monthly limits to stay on track."
        />

        <StatusBanner error={error} message={message} />

        <div className="form-section">
          <h3>Where does your money go?</h3>
          <p className="form-section-subtitle">
            Start by creating a category.
          </p>

          <form className="form-grid form-grid--triple" onSubmit={handleCreateCategory}>
            <TextField
              type="text"
              placeholder="Category name, e.g. Food"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <Select
              value={categoryKind}
              onChange={(e) => setCategoryKind(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>

            <Button type="submit">Add category</Button>
          </form>
        </div>

        <div className="form-section">
          <h3>Give your money a game plan</h3>
          <p className="form-section-subtitle">
            Pick a category, set a limit, and keep future-you on track.
          </p>

          <form
            className="form-grid form-grid--wide"
            onSubmit={handleCreateBudget}
          >
            <Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Choose a category</option>

              {categories
                .filter((category) => category.kind === "expense")
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </Select>

            <TextField
              type="month"
              value={budgetMonth}
              onChange={(e) => setBudgetMonth(e.target.value)}
            />

            <TextField
              type="number"
              placeholder="Amount, e.g. 500"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
            />

            <TextField
              type="text"
              placeholder="Notes optional"
              value={budgetNotes}
              onChange={(e) => setBudgetNotes(e.target.value)}
            />

            <Button type="submit">Create budget</Button>
          </form>
        </div>

        <div className="list">
          {budgets.length === 0 ? (
            <EmptyState icon={<PiggyBank />}>
              No budgets yet. Create one to start tracking your spending.
            </EmptyState>
          ) : (
            <>
              <div className="chip-row">
                {monthKeys.map((monthKey) => (
                  <button
                    key={monthKey}
                    type="button"
                    className={
                      openMonth === monthKey ? "chip chip--active" : "chip"
                    }
                    onClick={() => {
                      setSelectedMonth(monthKey);
                      setOpenMonth(openMonth === monthKey ? "" : monthKey);
                    }}
                  >
                    {formatMonth(`${monthKey}-01`)}
                  </button>
                ))}
              </div>

              {openMonth === selectedMonth &&
                visibleBudgets.map((budget) => {
                  const category = categories.find(
                    (cat) => cat.id === budget.category_id
                  );

                  return (
                    <div className="list-row" key={budget.id}>
                      <div className="list-row__icon">
                        <Tag />
                      </div>

                      <div className="list-row__text">
                        <h3>{category?.name || "Category"}</h3>
                        <p>{formatMonth(budget.period_month)}</p>
                      </div>

                      <div className="list-row__actions">
                        <div className="list-row__amount">
                          ${(budget.allocated_cents / 100).toFixed(2)}
                        </div>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Budget;
