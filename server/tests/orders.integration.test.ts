import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const skipReason = testDatabaseUrl
  ? false
  : "Set TEST_DATABASE_URL to run PostgreSQL integration tests";

type Services = typeof import("../services/orderService.js");
let services: Services;
let databasePool: (typeof import("../db/pool.js"))["pool"];

before(async () => {
  if (!testDatabaseUrl) return;
  process.env.DATABASE_URL = testDatabaseUrl;

  const database = await import("../db/pool.js");
  databasePool = database.pool;
  assert.ok(databasePool);

  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const migration = await readFile(
    path.resolve(
      currentDirectory,
      "../db/migrations/001_create_order_tables.sql"
    ),
    "utf8"
  );
  await databasePool.query(migration);
  await databasePool.query("DELETE FROM orders");
  services = await import("../services/orderService.js");
});

after(async () => {
  if (!databasePool) return;
  await databasePool.query("DELETE FROM orders");
  await databasePool.end();
});

test("requires the correct access token", { skip: skipReason }, async () => {
  const created = await services.createOrder();
  assert.ok(created.accessToken);
  assert.equal(await services.getOrder(created.id, crypto.randomUUID()), null);
  assert.equal(
    (await services.getOrder(created.id, created.accessToken))?.id,
    created.id
  );
});

test("rejects payment for an empty order", { skip: skipReason }, async () => {
  const order = await services.createOrder();
  await assert.rejects(
    services.updateOrderStatus(order.id, order.accessToken, "paid"),
    /EMPTY_ORDER/
  );
});

test("creates, reads, updates, and deletes order items", { skip: skipReason }, async () => {
  const order = await services.createOrder();
  const withItem = await services.addOrderItem(order.id, order.accessToken, {
    productName: "Latte",
    size: "Large",
    quantity: 1,
    addOns: ["Oat milk"],
  });
  assert.equal(withItem.total, 6.25);
  assert.equal(withItem.items.length, 1);

  const itemId = withItem.items[0].id;
  const updated = await services.updateOrderItem(
    order.id,
    order.accessToken,
    itemId,
    {
      productName: "Latte",
      size: "Large",
      quantity: 1,
      addOns: ["Extra shot"],
    }
  );
  assert.equal(updated.total, 6.5);
  assert.deepEqual(updated.items[0].addOns.map((addOn) => addOn.name), [
    "Extra shot",
  ]);

  const withoutItem = await services.deleteOrderItem(
    order.id,
    order.accessToken,
    itemId
  );
  assert.equal(withoutItem.total, 0);
  assert.equal(withoutItem.items.length, 0);
});

test("locks an order after valid payment", { skip: skipReason }, async () => {
  const order = await services.createOrder();
  await services.addOrderItem(order.id, order.accessToken, {
    productName: "Espresso",
    size: "Small",
    quantity: 1,
    addOns: [],
  });
  const paid = await services.updateOrderStatus(
    order.id,
    order.accessToken,
    "paid"
  );
  assert.equal(paid.status, "paid");
  await assert.rejects(
    services.updateOrderStatus(order.id, order.accessToken, "cancelled"),
    /INVALID_STATUS_TRANSITION/
  );
});

test("deletes a pending order", { skip: skipReason }, async () => {
  const order = await services.createOrder();
  assert.equal(
    await services.deleteOrder(order.id, order.accessToken),
    true
  );
  assert.equal(await services.getOrder(order.id, order.accessToken), null);
});
