import { getMonthKey, monthKeyToLabel } from "./moneyUtils";

const FALLBACK_COLORS = [
  "#7c3aed",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f97316",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#eab308",
  "#d946ef",
];

function isExpense(transaction) {
  return transaction.type === "expense";
}

function isIncome(transaction) {
  return transaction.type === "income";
}

export function getLastNMonthKeys(n, fromDate = new Date()) {
  const keys = [];
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth();

  for (let i = n - 1; i >= 0; i -= 1) {
    const date = new Date(year, month - i, 1);
    const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
    keys.push(`${date.getFullYear()}-${monthNumber}`);
  }

  return keys;
}

export function filterByMonth(transactions, monthKey) {
  return transactions.filter(
    (transaction) => getMonthKey(transaction.occurred_on) === monthKey
  );
}

export function buildMonthlySummary(transactions, monthKey) {
  const monthTransactions = filterByMonth(transactions, monthKey);

  let totalIncomeCents = 0;
  let totalExpensesCents = 0;

  for (const transaction of monthTransactions) {
    if (isIncome(transaction)) {
      totalIncomeCents += Number(transaction.amount_cents);
    } else if (isExpense(transaction)) {
      totalExpensesCents += Number(transaction.amount_cents);
    }
  }

  return {
    totalIncomeCents,
    totalExpensesCents,
    netCents: totalIncomeCents - totalExpensesCents,
  };
}

export function buildSpendingByCategory(transactions, categories, monthKey) {
  const monthExpenses = filterByMonth(transactions, monthKey).filter(isExpense);
  const categoryMap = new Map(
    categories.map((category) => [Number(category.id), category])
  );

  const spentByCategory = new Map();

  for (const transaction of monthExpenses) {
    const categoryId = Number(transaction.category_id);
    const current = spentByCategory.get(categoryId) ?? 0;
    spentByCategory.set(categoryId, current + Number(transaction.amount_cents));
  }

  const totalSpent = [...spentByCategory.values()].reduce(
    (sum, amount) => sum + amount,
    0
  );

  return [...spentByCategory.entries()]
    .map(([categoryId, spentCents]) => {
      const category = categoryMap.get(categoryId);

      return {
        categoryId,
        name: category?.name ?? "Uncategorized",
        icon: category?.icon ?? "💰",
        spentCents,
        percent: totalSpent > 0 ? (spentCents / totalSpent) * 100 : 0,
      };
    })
    .filter((row) => row.spentCents > 0)
    .sort((a, b) => b.spentCents - a.spentCents)
    .map((row, index) => ({
      ...row,
      color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }));
}

export function buildBudgetComparison(
  transactions,
  budgets,
  categories,
  monthKey
) {
  const monthExpenses = filterByMonth(transactions, monthKey).filter(isExpense);
  const categoryMap = new Map(
    categories.map((category) => [Number(category.id), category])
  );

  const spentByCategory = new Map();

  for (const transaction of monthExpenses) {
    const categoryId = Number(transaction.category_id);
    const current = spentByCategory.get(categoryId) ?? 0;
    spentByCategory.set(categoryId, current + Number(transaction.amount_cents));
  }

  const monthBudgets = budgets.filter(
    (budget) => getMonthKey(budget.period_month) === monthKey
  );

  const categoryIds = new Set([
    ...monthBudgets.map((budget) => Number(budget.category_id)),
    ...spentByCategory.keys(),
  ]);

  return [...categoryIds]
    .map((categoryId, index) => {
      const category = categoryMap.get(categoryId);
      const budget = monthBudgets.find(
        (item) => Number(item.category_id) === categoryId
      );
      const allocatedCents = Number(budget?.allocated_cents ?? 0);
      const spentCents = spentByCategory.get(categoryId) ?? 0;
      const remainingCents = allocatedCents - spentCents;
      const percentUsed =
        allocatedCents > 0 ? (spentCents / allocatedCents) * 100 : spentCents > 0 ? 100 : 0;

      return {
        categoryId,
        name: category?.name ?? "Uncategorized",
        icon: category?.icon ?? "💰",
        color: category?.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
        allocatedCents,
        spentCents,
        remainingCents,
        percentUsed,
      };
    })
    .filter((row) => row.allocatedCents > 0 || row.spentCents > 0)
    .sort((a, b) => b.percentUsed - a.percentUsed);
}

export function buildMonthlyTrend(transactions, monthKeys) {
  return monthKeys.map((monthKey) => {
    const summary = buildMonthlySummary(transactions, monthKey);

    return {
      monthKey,
      label: monthKeyToLabel(monthKey),
      shortLabel: monthKeyToLabel(monthKey).split(" ")[0].slice(0, 3),
      incomeCents: summary.totalIncomeCents,
      expenseCents: summary.totalExpensesCents,
    };
  });
}

export function buildMonthlyReport({
  transactions,
  categories,
  budgets,
  monthKey,
}) {
  const monthKeys = getLastNMonthKeys(6);

  return {
    monthKey,
    monthLabel: monthKeyToLabel(monthKey),
    summary: buildMonthlySummary(transactions, monthKey),
    spendingByCategory: buildSpendingByCategory(
      transactions,
      categories,
      monthKey
    ),
    budgetComparison: buildBudgetComparison(
      transactions,
      budgets,
      categories,
      monthKey
    ),
    trend: buildMonthlyTrend(transactions, monthKeys),
  };
}
