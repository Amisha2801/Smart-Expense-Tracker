# Transactions API

Income and expense ledger entries. Base path: `/api/transactions`.

**All endpoints require authentication.**

## Supported types

| Type | Effect on account balance | Category required |
|------|---------------------------|-------------------|
| `expense` | Decreases `current_balance_cents` | Yes (`kind: expense`) |
| `income` | Increases `current_balance_cents` | Yes (`kind: income`) |

`transfer` exists in the database schema but is **not** exposed by the API. Transfer rows cannot be created, updated, or deleted.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List all user transactions |
| POST | `/` | Create transaction |
| GET | `/:id` | Get one transaction |
| PATCH | `/:id` | Update transaction |
| DELETE | `/:id` | Delete transaction (hard delete) |

---

## GET /api/transactions

All transactions for the current user, newest first (`occurred_on DESC`, then `id DESC`).

### Response `200`

```json
{
  "data": [
    {
      "id": 42,
      "user_id": 1,
      "account_id": 1,
      "category_id": 5,
      "type": "expense",
      "amount_cents": 1750,
      "occurred_on": "2026-06-03",
      "payee": "Grocery Store",
      "notes": "Weekly shop",
      "transfer_group_id": null,
      "is_cleared": true,
      "created_at": "2026-06-03T10:00:00.000Z",
      "updated_at": "2026-06-03T10:00:00.000Z"
    }
  ]
}
```

Does **not** include `balance_after_cents`. Use `GET /api/accounts/:id/transactions` for per-account running balances.

---

## POST /api/transactions

Create a transaction and atomically update the account's `current_balance_cents`.

### Request body

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `account_id` | number | Yes | — | Must be owned, non-archived |
| `category_id` | number | Yes | — | Must be owned, non-archived; `kind` must match `type` |
| `type` | string | Yes | — | `expense` or `income` |
| `amount_cents` | integer | Yes | — | Must be > 0 |
| `occurred_on` | string | Yes | — | `YYYY-MM-DD` |
| `payee` | string \| null | No | `null` | Max 200 chars |
| `notes` | string \| null | No | `null` | |
| `is_cleared` | boolean | No | `false` | Reconciled / cleared flag |

```json
{
  "account_id": 1,
  "category_id": 5,
  "type": "expense",
  "amount_cents": 1750,
  "occurred_on": "2026-06-03",
  "payee": "Grocery Store",
  "notes": "Weekly shop",
  "is_cleared": true
}
```

### Response `201`

Full transaction object.

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `account_id must be positive` |
| 400 | `amount_cents must be greater than zero` |
| 400 | `occurred_on must be YYYY-MM-DD` |
| 400 | `Invalid account` |
| 400 | `Invalid category` |
| 400 | `Category kind must match transaction type (expense)` |

---

## GET /api/transactions/:id

Get one transaction.

### Response `200`

Transaction object.

### Errors

| Status | Message |
|--------|---------|
| 404 | `Transaction not found` |

---

## PATCH /api/transactions/:id

Partial update. Recalculates account balance(s) when `type`, `amount_cents`, or `account_id` change.

At least one field required.

### Request body (all optional)

Same fields as create, all optional.

```json
{
  "amount_cents": 2000,
  "is_cleared": true
}
```

If `account_id` changes, the old account is reverted and the new account receives the new signed amount.

If only `type` or `amount_cents` changes on the same account, the balance is adjusted by the delta.

### Response `200`

Updated transaction object.

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `Transfer transactions cannot be modified yet` |
| 400 | `Invalid account` / `Invalid category` |
| 400 | `No valid fields to update` |
| 404 | `Transaction not found` |

---

## DELETE /api/transactions/:id

Permanently deletes the row and reverses its effect on `current_balance_cents`.

### Response `200`

Returns the deleted transaction object (last known state).

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `Transfer transactions cannot be modified yet` |
| 404 | `Transaction not found` |

---

## Transaction object

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | |
| `user_id` | number | Owner |
| `account_id` | number | FK to accounts |
| `category_id` | number | FK to categories |
| `type` | string | `expense` or `income` (API-created) |
| `amount_cents` | number | Always positive; sign implied by `type` |
| `occurred_on` | string | `YYYY-MM-DD` |
| `payee` | string \| null | Merchant / payer label |
| `notes` | string \| null | Free text |
| `transfer_group_id` | string \| null | UUID for paired transfers (not used by API yet) |
| `is_cleared` | boolean | Reconciliation status |
| `created_at` | string | ISO timestamp |
| `updated_at` | string | ISO timestamp |

### Extended fields (account transactions only)

| Field | Type | Notes |
|-------|------|-------|
| `balance_after_cents` | number | Only on `GET /api/accounts/:id/transactions` |

## Balance impact

| Type | Delta applied to `current_balance_cents` |
|------|---------------------------------------------|
| `income` | `+amount_cents` |
| `expense` | `-amount_cents` |

Updates and deletes reverse the old effect before applying the new one.

## Frontend notes

- Always send amounts as positive integers; never send negative `amount_cents`.
- Validate `occurred_on` client-side as `YYYY-MM-DD` before submit.
- Join account/category names client-side using ids from list endpoints, or extend the API later with embedded relations.
- `is_cleared` is useful for "pending vs cleared" UI in a checkbook register.
- For account-specific views with running totals, prefer `GET /api/accounts/:id/transactions`.
