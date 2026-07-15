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

export async function createPasswordResetToken({
  userId,
  tokenHash,
  expiresAt,
}) {
  await pool.query(
    `INSERT INTO password_reset_tokens
     (user_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [userId, tokenHash, expiresAt]
  );
}

export async function findPasswordResetToken(tokenHash) {
  const [rows] = await pool.query(
    `SELECT *
     FROM password_reset_tokens
     WHERE token_hash = ?
       AND used_at IS NULL
       AND expires_at > NOW()`,
    [tokenHash]
  );

  return rows[0] ?? null;
}

export async function markPasswordResetTokenUsed(id) {
  await pool.query(
    `UPDATE password_reset_tokens
     SET used_at = NOW()
     WHERE id = ?`,
    [id]
  );
}

export async function updatePassword(userId, passwordHash) {
  await pool.query(
    `UPDATE users
     SET password_hash = ?
     WHERE id = ?`,
    [passwordHash, userId]
  );
}