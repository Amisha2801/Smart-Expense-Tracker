export function signedDelta(type, amountCents) {
  if (type === "income") return amountCents;
  if (type === "expense") return -amountCents;
  throw new Error(`Unsupported transaction type: ${type}`);
}
