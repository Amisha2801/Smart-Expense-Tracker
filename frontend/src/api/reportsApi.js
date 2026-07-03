import { getBudgets, getCategories } from "./budgetApi";
import { getTransactions } from "./transactionApi";

export async function fetchReportSourceData(monthKey) {
  const [transactionsResult, categoriesResult, budgetsResult] =
    await Promise.all([
      getTransactions(),
      getCategories(),
      getBudgets(monthKey),
    ]);

  if (transactionsResult.error) {
    return { error: transactionsResult.error };
  }

  if (categoriesResult.error) {
    return { error: categoriesResult.error };
  }

  if (budgetsResult.error) {
    return { error: budgetsResult.error };
  }

  return {
    transactions: transactionsResult.data || [],
    categories: categoriesResult.data || [],
    budgets: budgetsResult.data || [],
  };
}
