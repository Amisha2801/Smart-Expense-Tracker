import pool from "../db/pool.js";

const SELECT_FIELDS = `id, user_id, name, type, starting_balance_cents, current_balance_cents,
            currency, is_archived, created_at, updated_at`;

export async function findByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM accounts
     WHERE user_id = ? AND is_archived = FALSE
     ORDER BY name`,
    [userId]
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM accounts
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function create({
  userId,
  name,
  type,
  startingBalanceCents = 0,
  currency = "USD",
}) {
  const [result] = await pool.query(
    `INSERT INTO accounts
       (user_id, name, type, starting_balance_cents, current_balance_cents, currency)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, name, type, startingBalanceCents, startingBalanceCents, currency]
  );

  return findById(result.insertId);
}

export async function update(id, fields) {
  const allowed = [
    "name",
    "type",
    "starting_balance_cents",
    "current_balance_cents",
    "currency",
    "is_archived",
  ];
  const sets = [];
  const values = [];

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (sets.length === 0) {
    return findById(id);
  }

  values.push(id);

  await pool.query(
    `UPDATE accounts SET ${sets.join(", ")} WHERE id = ?`,
    values
  );

  return findById(id);
}

export async function adjustBalance(connection, accountId, deltaCents) {
  await connection.query(
    `UPDATE accounts
     SET current_balance_cents = current_balance_cents + ?
     WHERE id = ?`,
    [deltaCents, accountId]
  );
}
