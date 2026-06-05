# Backend API Documentation

Reference for frontend development against the Smart Expense Tracker API.

## Base URL

```
http://localhost:5000/api
```

Default port is `5000` (`PORT` env var). Health check: `GET /` returns plain text (not JSON).

## Authentication

Most endpoints require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via `POST /api/users/login`. Register via `POST /api/users/register` (no token required).

Token payload includes `sub` (user id) and `email`. Default expiry is 7 days (`JWT_EXPIRES_IN` env var).

See [users.md](./users.md) for auth endpoints.

## Response envelope

**Success** — JSON object with a `data` field:

```json
{ "data": { ... } }
```

For list endpoints, `data` is an array. Create endpoints return `201` with `{ "data": ... }`.

**Error** — JSON object with an `error` string:

```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|--------|---------|
| 400 | Validation or business rule failure |
| 401 | Missing, invalid, or expired token |
| 404 | Resource not found (or not owned by the user) |
| 500 | Unexpected server error |

## Conventions

### Field naming

Request and response bodies use **snake_case** (matches the database).

### Money

All monetary amounts are **integers in cents** (e.g. `$12.34` → `1234`). Never send floats for money.

Relevant fields: `starting_balance_cents`, `current_balance_cents`, `amount_cents`, `balance_after_cents`.

### Dates

Date-only fields use **`YYYY-MM-DD`** strings (e.g. `"2026-06-03"`).

Timestamp fields (`created_at`, `updated_at`) are ISO 8601 strings from MySQL.

### IDs

Resource ids are numeric (`BIGINT`). Route params and foreign keys are coerced to integers server-side.

### Ownership

All resources (except public auth routes) are scoped to the authenticated user. Requesting another user's id returns **404**, not 403.

### Soft delete vs hard delete

| Resource | Delete behavior |
|----------|-----------------|
| Accounts | Soft delete — sets `is_archived: true`; hidden from list |
| Categories | Soft delete — sets `is_archived: true`; hidden from list |
| Transactions | Hard delete — row removed; account balance adjusted |

### Account balances

- `starting_balance_cents` — baseline when the account was created (editable; adjusts `current_balance_cents` by the delta).
- `current_balance_cents` — live balance maintained when expense/income transactions are created, updated, or deleted.
- `GET /api/accounts/:id/transactions` also returns `balance_after_cents` per row (running balance for the register view).

## Resources

| Resource | Base path | Doc |
|----------|-----------|-----|
| Users (auth) | `/api/users` | [users.md](./users.md) |
| Accounts | `/api/accounts` | [accounts.md](./accounts.md) |
| Categories | `/api/categories` | [categories.md](./categories.md) |
| Transactions | `/api/transactions` | [transactions.md](./transactions.md) |

## Not yet implemented

The database includes a **`budgets`** table (monthly envelope allocations) but there is **no REST API** for budgets yet.

**Transfer** transactions exist in the schema (`type: "transfer"`, paired via `transfer_group_id`) but the API currently only supports `expense` and `income`. Transfer rows cannot be created, updated, or deleted via the API.
