import pg from "pg";

const { Pool } = pg;

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

export const pool = isDatabaseConfigured
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
  : null;

export function requireDatabase() {
  if (!pool) {
    const error = new Error(
      "PostgreSQL is not configured. Set DATABASE_URL and run the migrations."
    );
    error.name = "DatabaseUnavailableError";
    throw error;
  }

  return pool;
}

export async function closeDatabase() {
  await pool?.end();
}
