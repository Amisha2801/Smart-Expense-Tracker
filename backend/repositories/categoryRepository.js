import pool from "../db/pool.js";

const SELECT_FIELDS = `id, user_id, parent_id, name, kind, icon, color, sort_order,
            is_archived, created_at`;

export async function findByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM categories
     WHERE user_id = ? AND is_archived = FALSE
     ORDER BY sort_order, name`,
    [userId]
  );

  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT ${SELECT_FIELDS}
     FROM categories
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function create({
  userId,
  name,
  kind = "expense",
  parentId = null,
  icon = null,
  color = null,
  sortOrder = 0,
}) {
  const [result] = await pool.query(
    `INSERT INTO categories (user_id, parent_id, name, kind, icon, color, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, parentId, name, kind, icon, color, sortOrder]
  );

  return findById(result.insertId);
}

export async function update(id, fields) {
  const allowed = [
    "name",
    "kind",
    "parent_id",
    "icon",
    "color",
    "sort_order",
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
    `UPDATE categories SET ${sets.join(", ")} WHERE id = ?`,
    values
  );

  return findById(id);
}
