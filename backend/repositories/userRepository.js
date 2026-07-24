import pool from "../db/pool.js";

export async function findByEmail(email) {
  const [rows] = await pool.query(
    `SELECT
       id,
       email,
       password_hash,
       name,
       created_at,
       updated_at
     FROM users
     WHERE email = ?`,
    [email]
  );

  return rows[0] ?? null;
}

export async function findById(id) {
  const [rows] = await pool.query(
    `SELECT
       id,
       email,
       name,
       created_at,
       updated_at
     FROM users
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function findByIdWithPassword(id) {
  const [rows] = await pool.query(
    `SELECT
       id,
       email,
       password_hash,
       name,
       created_at,
       updated_at
     FROM users
     WHERE id = ?`,
    [id]
  );

  return rows[0] ?? null;
}

export async function create({
  email,
  passwordHash,
  name,
}) {
  const [result] = await pool.query(
    `INSERT INTO users
       (email, password_hash, name)
     VALUES (?, ?, ?)`,
    [email, passwordHash, name]
  );

  return {
    id: result.insertId,
    email,
    name,
  };
}

export async function deleteUserAndData(userId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `DELETE FROM password_reset_tokens
       WHERE user_id = ?`,
      [userId]
    );

    await connection.query(
      `DELETE FROM transactions
       WHERE user_id = ?`,
      [userId]
    );

    await connection.query(
      `DELETE FROM budgets
       WHERE user_id = ?`,
      [userId]
    );

    await connection.query(
      `DELETE FROM categories
       WHERE user_id = ?`,
      [userId]
    );

    await connection.query(
      `DELETE FROM accounts
       WHERE user_id = ?`,
      [userId]
    );

    const [result] = await connection.query(
      `DELETE FROM users
       WHERE id = ?`,
      [userId]
    );

    if (result.affectedRows !== 1) {
      throw new Error(
        "User account could not be deleted."
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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

export async function findPasswordResetToken(
  tokenHash
) {
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

export async function markPasswordResetTokenUsed(
  id
) {
  await pool.query(
    `UPDATE password_reset_tokens
     SET used_at = NOW()
     WHERE id = ?`,
    [id]
  );
}

export async function updatePassword(
  userId,
  passwordHash
) {
  await pool.query(
    `UPDATE users
     SET password_hash = ?
     WHERE id = ?`,
    [passwordHash, userId]
  );
}