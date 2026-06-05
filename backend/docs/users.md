# Users API

Authentication and current-user profile. Base path: `/api/users`.

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Sign in, receive JWT |
| GET | `/me` | Yes | Current user profile |

---

## POST /api/users/register

Create a new user.

### Request body

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | string | Yes | Must be unique |
| `password` | string | Yes | Stored hashed (bcrypt) |
| `name` | string | Yes | Display name |

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "Jane Doe"
}
```

### Response `201`

```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

Password hash is never returned.

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `email, password, and name are required` |
| 400 | `Email already in use` |

---

## POST /api/users/login

Authenticate and receive a JWT.

### Request body

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Response `200`

```json
{
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Jane Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Store `token` and send it on subsequent requests as `Authorization: Bearer <token>`.

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 400 | `email and password are required` |
| 400 | `Invalid credentials` |

---

## GET /api/users/me

Return the authenticated user's profile.

### Headers

```
Authorization: Bearer <token>
```

### Response `200`

```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

### Errors

| Status | Message (examples) |
|--------|-------------------|
| 401 | `Missing or invalid token` |
| 401 | `Invalid or expired token` |
| 404 | `User not found` |

---

## User object (API shape)

Fields returned to the client (never includes `password_hash`):

| Field | Type | Notes |
|-------|------|-------|
| `id` | number | Primary key |
| `email` | string | Unique |
| `name` | string | |

Database also stores `created_at` and `updated_at` on users, but they are **not** included in API responses today.

## Frontend notes

- After login, persist `token` (e.g. localStorage or httpOnly cookie if you add a BFF later).
- On `401` from any endpoint, clear the token and redirect to login.
- Registration does **not** return a token; call login after register or redirect to login.
