import pool from "../db/pool.js";

export async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, email, password_hash, name, created_at, updated_at
     FROM users
     WHERE email = ?`,
    [email]
  );

  return rows[0] ?? null;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, email, name, created_at, updated_at
     FROM users
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function create({ email, passwordHash, name }) {
  const [result] = await pool.query(
    `INSERT INTO users (email, password_hash, name)
     VALUES (?, ?, ?)`,
    [email, passwordHash, name]
  );

  return { id: result.insertId, email, name };
}
