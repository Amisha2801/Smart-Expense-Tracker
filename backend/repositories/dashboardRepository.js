import pool from "../db/pool.js";

export async function getDashboardSummary(userId) {
  const [expenseRows] = await pool.query(
    `
    SELECT COALESCE(SUM(amount_cents), 0) AS totalExpenses
    FROM transactions
    WHERE user_id = ?
      AND type = 'expense'
      AND MONTH(occurred_on) = MONTH(CURRENT_DATE())
      AND YEAR(occurred_on) = YEAR(CURRENT_DATE())
    `,
    [userId]
  );

  const [budgetRows] = await pool.query(
    `
    SELECT COALESCE(SUM(allocated_cents), 0) AS monthlyBudget
    FROM budgets
    WHERE user_id = ?
      AND MONTH(period_month) = MONTH(CURRENT_DATE())
      AND YEAR(period_month) = YEAR(CURRENT_DATE())
    `,
    [userId]
  );

  const [transactionCountRows] = await pool.query(
    `
    SELECT COUNT(*) AS transactionCount
    FROM transactions
    WHERE user_id = ?
      AND MONTH(occurred_on) = MONTH(CURRENT_DATE())
      AND YEAR(occurred_on) = YEAR(CURRENT_DATE())
    `,
    [userId]
  );

  const [recentTransactions] = await pool.query(
    `
    SELECT
      transactions.id,
      transactions.type,
      transactions.amount_cents,
      transactions.occurred_on,
      transactions.payee,
      transactions.notes,
      categories.name AS category_name,
      accounts.name AS account_name
    FROM transactions
    LEFT JOIN categories ON transactions.category_id = categories.id
    LEFT JOIN accounts ON transactions.account_id = accounts.id
    WHERE transactions.user_id = ?
    ORDER BY transactions.occurred_on DESC, transactions.created_at DESC
    LIMIT 5
    `,
    [userId]
  );

  const totalExpenses = Number(expenseRows[0]?.totalExpenses ?? 0);
  const monthlyBudget = Number(budgetRows[0]?.monthlyBudget ?? 0);
  const remainingBudget = monthlyBudget - totalExpenses;
  const transactionCount = Number(transactionCountRows[0]?.transactionCount ?? 0);
  
  return {
    totalExpenses,
    monthlyBudget,
    remainingBudget,
    transactionCount,
    totalExpensesDollars: totalExpenses / 100,
    monthlyBudgetDollars: monthlyBudget / 100,
    remainingBudgetDollars: remainingBudget / 100,
    recentTransactions,
  };
}