import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import test, { after, before } from "node:test";
import { app } from "../app.js";
import { closeDatabase } from "../db/pool.js";

let server: ReturnType<typeof app.listen>;
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      const address = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await closeDatabase();
});

test("adds request IDs and centralizes API 404 responses", async () => {
  const response = await fetch(`${baseUrl}/api/unknown`);
  assert.equal(response.status, 404);
  assert.ok(response.headers.get("x-request-id"));
  assert.deepEqual(await response.json(), { error: "API route not found" });
});

test("protects order routes before controller execution", async () => {
  const response = await fetch(
    `${baseUrl}/api/orders/00000000-0000-4000-8000-000000000000`
  );
  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), {
    error: "Order access token is required",
    code: "ORDER_TOKEN_REQUIRED",
  });
});

test("validates chat request bodies in middleware", async () => {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "" }),
  });
  assert.equal(response.status, 400);
  const body = (await response.json()) as { error: string };
  assert.equal(body.error, "Invalid request");
});
