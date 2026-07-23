import type { Pool, PoolClient } from "pg";

export type OrderStatus = "pending" | "paid" | "cancelled";

export type Queryable = Pool | PoolClient;

export type InternalOrder = {
  id: number;
  public_id: string;
  status: OrderStatus;
  total: string;
  created_at: string;
  updated_at: string;
};

const orderColumns =
  "id, public_id, status, total, created_at, updated_at";

export async function createOrderRecord(
  database: Queryable,
  publicId: string,
  accessToken: string
) {
  const result = await database.query<InternalOrder>(
    `INSERT INTO orders (public_id, access_token)
     VALUES ($1, $2) RETURNING ${orderColumns}`,
    [publicId, accessToken]
  );
  return result.rows[0];
}

export async function findOwnedOrder(
  database: Queryable,
  publicId: string,
  accessToken: string,
  lock = false
) {
  const result = await database.query<InternalOrder>(
    `SELECT ${orderColumns} FROM orders
     WHERE public_id = $1 AND access_token = $2
     ${lock ? "FOR UPDATE" : ""}`,
    [publicId, accessToken]
  );
  return result.rows[0] ?? null;
}

export async function listOrderItems(database: Queryable, internalOrderId: number) {
  const result = await database.query(
    `SELECT item.id, item.product_name, item.size, item.unit_price,
            item.quantity, item.created_at,
            COALESCE(
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', add_on.id,
                  'name', add_on.name,
                  'price', link.price_at_purchase
                ) ORDER BY add_on.id
              ) FILTER (WHERE add_on.id IS NOT NULL),
              '[]'::json
            ) AS add_ons
     FROM order_items item
     LEFT JOIN order_item_add_ons link ON link.order_item_id = item.id
     LEFT JOIN add_ons add_on ON add_on.id = link.add_on_id
     WHERE item.order_id = $1
     GROUP BY item.id
     ORDER BY item.id`,
    [internalOrderId]
  );
  return result.rows;
}

export async function findMenuItem(database: Queryable, name: string) {
  const result = await database.query(
    `SELECT id, name, base_price FROM menu_items
     WHERE LOWER(name) = LOWER($1) AND available = TRUE`,
    [name]
  );
  return result.rows[0] ?? null;
}

export async function findAddOns(database: Queryable, names: string[]) {
  if (!names.length) return [];
  const result = await database.query(
    `SELECT id, name, price FROM add_ons
     WHERE LOWER(name) = ANY($1::text[]) AND available = TRUE`,
    [names.map((name) => name.toLowerCase())]
  );
  return result.rows;
}

export async function insertOrderItem(
  client: PoolClient,
  values: {
    orderId: number;
    menuItemId: number;
    productName: string;
    size: string;
    unitPrice: number;
    quantity: number;
  }
) {
  const result = await client.query<{ id: number }>(
    `INSERT INTO order_items
       (order_id, menu_item_id, product_name, size, unit_price, quantity)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [
      values.orderId,
      values.menuItemId,
      values.productName,
      values.size,
      values.unitPrice,
      values.quantity,
    ]
  );
  return result.rows[0].id;
}

export async function updateOrderItemRecord(
  client: PoolClient,
  values: {
    itemId: number;
    orderId: number;
    menuItemId: number;
    productName: string;
    size: string;
    unitPrice: number;
    quantity: number;
  }
) {
  const result = await client.query(
    `UPDATE order_items
     SET menu_item_id = $3, product_name = $4, size = $5,
         unit_price = $6, quantity = $7
     WHERE id = $1 AND order_id = $2`,
    [
      values.itemId,
      values.orderId,
      values.menuItemId,
      values.productName,
      values.size,
      values.unitPrice,
      values.quantity,
    ]
  );
  return Boolean(result.rowCount);
}

export async function replaceItemAddOns(
  client: PoolClient,
  itemId: number,
  addOns: Array<{ id: number; price: string }>
) {
  await client.query("DELETE FROM order_item_add_ons WHERE order_item_id = $1", [
    itemId,
  ]);
  for (const addOn of addOns) {
    await client.query(
      `INSERT INTO order_item_add_ons
         (order_item_id, add_on_id, price_at_purchase)
       VALUES ($1, $2, $3)`,
      [itemId, addOn.id, addOn.price]
    );
  }
}

export async function deleteOrderItemRecord(
  client: PoolClient,
  internalOrderId: number,
  itemId: number
) {
  const result = await client.query(
    "DELETE FROM order_items WHERE id = $1 AND order_id = $2",
    [itemId, internalOrderId]
  );
  return Boolean(result.rowCount);
}

export async function recalculateOrderTotal(
  client: PoolClient,
  internalOrderId: number
) {
  await client.query(
    `UPDATE orders
     SET total = COALESCE((
       SELECT SUM(
         (item.unit_price + COALESCE(add_on_totals.total, 0)) * item.quantity
       )
       FROM order_items item
       LEFT JOIN (
         SELECT order_item_id, SUM(price_at_purchase) AS total
         FROM order_item_add_ons GROUP BY order_item_id
       ) add_on_totals ON add_on_totals.order_item_id = item.id
       WHERE item.order_id = orders.id
     ), 0), updated_at = NOW()
     WHERE id = $1`,
    [internalOrderId]
  );
}

export async function orderHasItems(database: Queryable, internalOrderId: number) {
  const result = await database.query(
    "SELECT 1 FROM order_items WHERE order_id = $1 LIMIT 1",
    [internalOrderId]
  );
  return Boolean(result.rowCount);
}

export async function updateOrderStatusRecord(
  client: PoolClient,
  internalOrderId: number,
  status: OrderStatus
) {
  const result = await client.query<InternalOrder>(
    `UPDATE orders SET status = $2, updated_at = NOW()
     WHERE id = $1 RETURNING ${orderColumns}`,
    [internalOrderId, status]
  );
  return result.rows[0];
}

export async function deletePendingOrder(
  database: Queryable,
  publicId: string,
  accessToken: string
) {
  const result = await database.query(
    `DELETE FROM orders
     WHERE public_id = $1 AND access_token = $2 AND status = 'pending'`,
    [publicId, accessToken]
  );
  return Boolean(result.rowCount);
}
