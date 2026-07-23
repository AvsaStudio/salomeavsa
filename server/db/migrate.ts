import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { closeDatabase, requireDatabase } from "./pool.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(
  currentDirectory,
  "migrations/schema.sql"
);

try {
  const sql = await readFile(migrationPath, "utf8");
  await requireDatabase().query(sql);
  console.log("PostgreSQL migration completed.");
} finally {
  await closeDatabase();
}
