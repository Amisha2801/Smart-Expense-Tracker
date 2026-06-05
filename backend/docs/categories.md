# Categories API

Budget envelopes / spending categories. Supports optional nesting via `parent_id`. Base path: `/api/categories`.

**All endpoints require authentication.**

## Category kinds

| Value | Use for |
|-------|---------|
| `expense` | Expense transactions (default) |
| `income` | Income transactions |

A category's `kind` must match the transaction `type` when assigning transactions.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List active categories |
| POST | `/` | Create category |
| GET | `/:id` | Get one category |
| PATCH | `/:id` | Update category |
| DELETE | `/:id` | Archive category (soft delete) |

---

## GET /api/categories

List non-archived categories for the current user, ordered by `sort_order`, then `name`.

### Response `200`

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "parent_id": null,
      "name": "Food",
      "kind": "expense",
      "icon": "utensils",
      "color": "#FF5733",
      "sort_order": 0,
      "is_archived": false,
      "created_at": "2026-06-01T12:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "parent_id": 1,
      "name": "Groceries",
      "kind": "expense",
      "icon": null,
      "color": null,
      "sort_order": 1,
      "is_archived": false,
      "created_at": "2026-06-01T12:05:00.000Z"
    }
  ]
}
```

Build a tree on the frontend by grouping on `parent_id`.

---

## POST /api/categories

Create a category.

### Request body

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `name` | string | Yes | — | Unique per user within same `parent_id` |
| `kind` | string | No | `"expense"` | `expense` or `income` |
| `parent_id` | number \| null | No | `null` | Must be owned, non-archived category |
| `icon` | string \| null | No | `null` | Max 50 chars |
| `color` | string \| null | No | `null` | Hex `#RRGGBB` |
| `sort_order` | integer | No | `0` | Display order |

```json
{
  "name": "Groceries",
  "kind": "expense",
  "parent_id": 1,
  "icon": "cart",
  "color": "#33FF57",
  "sort_order": 1
}
```

### Response `201`

Full category object.

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `name is required` |
| 400 | `Invalid parent category` |
| 400 | `color must be a hex color like #FF5733` |
| 400 | DB unique constraint — duplicate name under same parent |

---

## GET /api/categories/:id

Get one category (including archived).

### Response `200`

Category object.

### Errors

| Status | Message |
|--------|---------|
| 404 | `Category not found` |

---

## PATCH /api/categories/:id

Partial update. At least one field required.

### Request body (all optional)

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Non-empty |
| `kind` | string | `expense` or `income` |
| `parent_id` | number \| null | Cannot be self; must be valid parent |
| `icon` | string \| null | |
| `color` | string \| null | Hex or null to clear |
| `sort_order` | integer | |
| `is_archived` | boolean | |

```json
{
  "sort_order": 2,
  "color": "#AABBCC"
}
```

### Response `200`

Updated category object.

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `Category cannot be its own parent` |
| 400 | `Invalid parent category` |
| 400 | `No valid fields to update` |
| 404 | `Category not found` |

---

## DELETE /api/categories/:id

Soft-delete: sets `is_archived` to `true`. Existing transactions keep their `category_id` (`ON DELETE SET NULL` at DB level for future deletes; archive does not null references).

### Response `200`

Category object with `is_archived: true`.

### Errors

| Status | Message |
|--------|---------|
| 404 | `Category not found` |

---

## Category object

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | |
| `user_id` | number | Owner |
| `parent_id` | number \| null | Parent category for nesting |
| `name` | string | |
| `kind` | string | `expense` or `income` |
| `icon` | string \| null | Opaque string for UI icon lookup |
| `color` | string \| null | `#RRGGBB` |
| `sort_order` | number | Lower sorts first |
| `is_archived` | boolean | |
| `created_at` | string | ISO timestamp |

No `updated_at` on categories in the current schema.

## Frontend notes

- Filter categories by `kind` when populating expense vs income pickers.
- When creating a transaction, only offer categories where `category.kind === transaction.type`.
- Archived categories are hidden from list but assigning them on new transactions fails validation.
- Parent deletion in DB sets children's `parent_id` to null; archiving via API does not cascade.
