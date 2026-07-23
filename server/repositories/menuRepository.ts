import type { Pool } from "pg";

export async function listAvailableMenuItems(database: Pool) {
  const result = await database.query(
    `SELECT id, name, base_price
     FROM menu_items WHERE available = TRUE ORDER BY id`
  );
  return result.rows;
}

export async function listAvailableAddOns(database: Pool) {
  const result = await database.query(
    `SELECT id, name, price
     FROM add_ons WHERE available = TRUE ORDER BY id`
  );
  return result.rows;
}
