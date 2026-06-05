import pool from "../db/pool.js";

const SELECT_FIELDS = `id, user_id, account_id, category_id, type, amount_cents,
            occurred_on, payee, notes, transfer_group_id, is_cleared,
            created_at, updated_at`;

async function findByIdOnConnection(connection, id) {
  const [rows] = await connection.query(
    `SELECT ${SELECT_FIELDS}
     FROM transactions
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function findByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM transactions
     WHERE user_id = ?
     ORDER BY occurred_on DESC, id DESC`,
    [userId]
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM transactions
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function findByAccountIdWithRunningBalance(accountId, userId) {
  const [rows] = await pool.query(
    `SELECT t.id, t.user_id, t.account_id, t.category_id, t.type, t.amount_cents,
            t.occurred_on, t.payee, t.notes, t.transfer_group_id, t.is_cleared,
            t.created_at, t.updated_at,
            a.starting_balance_cents + SUM(
              CASE WHEN t.type = 'income' THEN t.amount_cents
                   WHEN t.type = 'expense' THEN -t.amount_cents
                   ELSE 0 END
            ) OVER (ORDER BY t.occurred_on ASC, t.id ASC
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
            AS balance_after_cents
     FROM transactions t
     JOIN accounts a ON a.id = t.account_id
     WHERE t.account_id = ? AND t.user_id = ?
     ORDER BY t.occurred_on DESC, t.id DESC`,
    [accountId, userId]
  );

  return rows;
}

export async function create(
  connection,
  {
    userId,
    accountId,
    categoryId,
    type,
    amountCents,
    occurredOn,
    payee = null,
    notes = null,
    isCleared = false,
  }
) {
  const [result] = await connection.query(
    `INSERT INTO transactions
       (user_id, account_id, category_id, type, amount_cents, occurred_on,
        payee, notes, is_cleared)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      accountId,
      categoryId,
      type,
      amountCents,
      occurredOn,
      payee,
      notes,
      isCleared,
    ]
  );

  return findByIdOnConnection(connection, result.insertId);
}

export async function update(connection, id, fields) {
  const allowed = [
    "account_id",
    "category_id",
    "type",
    "amount_cents",
    "occurred_on",
    "payee",
    "notes",
    "is_cleared",
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
    return findByIdOnConnection(connection, id);
  }

  values.push(id);

  await connection.query(
    `UPDATE transactions SET ${sets.join(", ")} WHERE id = ?`,
    values
  );

  return findByIdOnConnection(connection, id);
}

export async function remove(connection, id) {
  const [result] = await connection.query(
    `DELETE FROM transactions WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}
