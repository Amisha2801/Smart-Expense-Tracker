import { API_BASE_URL } from "./config";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return data;
}

export async function createCategory({ name, kind = "expense", icon, color }) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name,
      kind,
      icon: icon || "💰",
      color: color || "#8b5cf6",
    }),
  });

  const data = await response.json();
  return data;
}

export async function getBudgets(periodMonth) {
  const query = periodMonth
    ? `?period_month=${encodeURIComponent(periodMonth)}`
    : "";

  const response = await fetch(`${API_BASE_URL}/budgets${query}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return data;
}

export async function createBudget({
  categoryId,
  periodMonth,
  amountDollars,
  notes,
}) {
  const response = await fetch(`${API_BASE_URL}/budgets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      category_id: Number(categoryId),
      period_month: periodMonth,
      allocated_cents: Math.round(Number(amountDollars) * 100),
      rolls_over: false,
      notes: notes || null,
    }),
  });

  const data = await response.json();
  return data;
}

export async function deleteBudget(budgetId) {
  const response = await fetch(`${API_BASE_URL}/budgets/${budgetId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return data;
}