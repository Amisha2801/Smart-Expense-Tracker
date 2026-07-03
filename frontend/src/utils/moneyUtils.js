export function formatCents(cents) {
  const amount = Number(cents) / 100;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function getMonthKey(dateValue) {
  return String(dateValue).slice(0, 7);
}

export function monthKeyToLabel(monthKey) {
  const [year, month] = monthKey.split("-");

  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}
