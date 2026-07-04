import { API_BASE_URL } from "./config";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getAccounts() {
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return data;
}

export async function createAccount({ name, type, startingBalanceDollars }) {
  const response = await fetch(`${API_BASE_URL}/accounts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name,
      type,
      starting_balance_cents: Math.round(Number(startingBalanceDollars) * 100),
      currency: "USD",
    }),
  });

  const data = await response.json();
  return data;
}

export async function getTransactions() {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return data;
}

export async function createTransaction({
  accountId,
  categoryId,
  type,
  amountDollars,
  occurredOn,
  payee,
  notes,
}) {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      account_id: Number(accountId),
      category_id: Number(categoryId),
      type,
      amount_cents: Math.round(Number(amountDollars) * 100),
      occurred_on: occurredOn,
      payee: payee || null,
      notes: notes || null,
      is_cleared: true,
    }),
  });

  const data = await response.json();
  return data;
}
export async function deleteTransaction(transactionId) {
  const response = await fetch(
    `${API_BASE_URL}/transactions/${transactionId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();
  return data;
}