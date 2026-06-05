# Accounts API

Bank accounts, cash envelopes, credit cards, etc. Base path: `/api/accounts`.

**All endpoints require authentication.**

## Account types

| Value | Description |
|-------|-------------|
| `checking` | Checking account |
| `savings` | Savings account |
| `credit_card` | Credit card |
| `cash` | Cash on hand |
| `investment` | Investment account |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List active (non-archived) accounts |
| POST | `/` | Create account |
| GET | `/:id` | Get one account |
| PATCH | `/:id` | Update account |
| DELETE | `/:id` | Archive account (soft delete) |
| GET | `/:id/transactions` | Transactions for account with running balance |

---

## GET /api/accounts

List the current user's non-archived accounts, ordered by name.

### Response `200`

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Main Checking",
      "type": "checking",
      "starting_balance_cents": 50000,
      "current_balance_cents": 48250,
      "currency": "USD",
      "is_archived": false,
      "created_at": "2026-06-01T12:00:00.000Z",
      "updated_at": "2026-06-03T10:30:00.000Z"
    }
  ]
}
```

---

## POST /api/accounts

Create a new account. `current_balance_cents` is initialized to match `starting_balance_cents`.

### Request body

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | string | Yes | — | Non-empty, trimmed |
| `type` | string | Yes | — | One of account types above |
| `starting_balance_cents` | integer | No | `0` | Can be negative (e.g. credit card debt) |
| `currency` | string | No | `"USD"` | 3-letter ISO code, uppercase |

```json
{
  "name": "Main Checking",
  "type": "checking",
  "starting_balance_cents": 50000,
  "currency": "USD"
}
```

### Response `201`

Full account object (same shape as list item).

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `name is required` |
| 400 | `type must be one of: checking, savings, credit_card, cash, investment` |
| 400 | `currency must be a 3-letter ISO code` |

---

## GET /api/accounts/:id

Get a single account by id (including archived).

### Response `200`

Account object.

### Errors

| Status | Message |
|--------|---------|
| 404 | `Account not found` |

---

## PATCH /api/accounts/:id

Partial update. At least one field required.

### Request body (all optional)

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Non-empty |
| `type` | string | Valid account type |
| `starting_balance_cents` | integer | Changing this adjusts `current_balance_cents` by the same delta |
| `currency` | string | 3-letter ISO |
| `is_archived` | boolean | Can un-archive via patch |

```json
{
  "name": "Primary Checking"
}
```

### Response `200`

Updated account object.

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `No valid fields to update` |
| 404 | `Account not found` |

---

## DELETE /api/accounts/:id

Soft-delete: sets `is_archived` to `true`. Account row remains; transactions referencing it are **not** deleted (`ON DELETE RESTRICT`).

### Response `200`

```json
{
  "data": {
    "id": 1,
    "...": "...",
    "is_archived": true
  }
}
```

### Errors

| Status | Message |
|--------|---------|
| 404 | `Account not found` |

---

## GET /api/accounts/:id/transactions

Transactions for one account, newest first, each with a **running balance** after that transaction.

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
      "notes": null,
      "transfer_group_id": null,
      "is_cleared": true,
      "created_at": "2026-06-03T10:00:00.000Z",
      "updated_at": "2026-06-03T10:00:00.000Z",
      "balance_after_cents": 48250
    }
  ]
}
```

`balance_after_cents` is computed from `starting_balance_cents` plus cumulative income/expense through that row (ordered by `occurred_on`, then `id`). Transfer rows contribute `0` to the running sum.

### Errors

| Status | Message |
|--------|---------|
| 404 | `Account not found` |

---

## Account object

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | |
| `user_id` | number | Owner |
| `name` | string | |
| `type` | string | Account type enum |
| `starting_balance_cents` | number | Baseline balance |
| `current_balance_cents` | number | Live balance (updated by transactions) |
| `currency` | string | e.g. `"USD"` |
| `is_archived` | boolean | |
| `created_at` | string | ISO timestamp |
| `updated_at` | string | ISO timestamp |

## Frontend notes

- Display balances as `current_balance_cents / 100` with currency formatting.
- Use `GET /:id/transactions` for account register / ledger UI; use `GET /api/transactions` for a global transaction feed.
- Archived accounts disappear from `GET /` but can still be fetched by id if needed.
- Creating transactions against archived accounts is rejected (`Invalid account`).
