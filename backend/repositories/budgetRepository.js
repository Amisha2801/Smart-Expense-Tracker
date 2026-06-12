import pool from "../db/pool.js";

const SELECT_FIELDS = `id, user_id, category_id, period_month, allocated_cents,
            rolls_over, notes, created_at, updated_at`;

export async function findByUserId(userId, { periodMonth = null } = {}) {
  const conditions = ["user_id = ?"];
  const values = [userId];

  if (periodMonth) {
    conditions.push("period_month = ?");
    values.push(periodMonth);
  }

  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM budgets
     WHERE ${conditions.join(" AND ")}
     ORDER BY period_month DESC, category_id`,
    values
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM budgets
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function findByCategoryAndPeriod(categoryId, periodMonth) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM budgets
     WHERE category_id = ? AND period_month = ?`,
    [categoryId, periodMonth]
  );

  return rows[0] ?? null;
}

export async function create({
  userId,
  categoryId,
  periodMonth,
  allocatedCents = 0,
  rollsOver = false,
  notes = null,
}) {
  const [result] = await pool.query(
    `INSERT INTO budgets (user_id, category_id, period_month, allocated_cents, rolls_over, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, categoryId, periodMonth, allocatedCents, rollsOver, notes]
  );

  return findById(result.insertId);
}

export async function update(id, fields) {
  const allowed = [
    "category_id",
    "period_month",
    "allocated_cents",
    "rolls_over",
    "notes",
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
    `UPDATE budgets SET ${sets.join(", ")} WHERE id = ?`,
    values
  );

  return findById(id);
}

export async function remove(id) {
  const existing = await findById(id);

  if (!existing) {
    return null;
  }

  await pool.query(`DELETE FROM budgets WHERE id = ?`, [id]);

  return existing;
}
