import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import mysql from "mysql2/promise";
import pool from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

const MIGRATIONS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    applied_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

async function ensureMigrationsTable(connection) {
  await connection.query(MIGRATIONS_TABLE_SQL);
}

async function getAppliedMigrations(connection) {
  const [rows] = await connection.query(
    "SELECT name FROM schema_migrations ORDER BY name"
  );
  return new Set(rows.map((row) => row.name));
}

function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

async function ensureDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  });

  const dbName = process.env.DB_NAME || "expense_tracker";

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  } finally {
    await connection.end();
  }
}

export async function runMigrations() {
  await ensureDatabase();

  const connection = await pool.getConnection();

  try {
    await ensureMigrationsTable(connection);
    const applied = await getAppliedMigrations(connection);
    const files = getMigrationFiles();
    const pending = files.filter((file) => !applied.has(file));

    if (pending.length === 0) {
      console.log("Database migrations: up to date");
      return;
    }

    for (const file of pending) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Running migration: ${file}`);
      await connection.query(sql);
      await connection.query(
        "INSERT INTO schema_migrations (name) VALUES (?)",
        [file]
      );
      console.log(`Applied migration: ${file}`);
    }

    console.log(`Database migrations: ${pending.length} applied`);
  } finally {
    connection.release();
  }
}
