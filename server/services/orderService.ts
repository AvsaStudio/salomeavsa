import { randomUUID } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import { requireDatabase } from "../db/pool.js";
import { AppError } from "../errors/AppError.js";
import * as orders from "../repositories/orderRepository.js";

type OrderStatus = orders.OrderStatus;

type ItemInput = {
  productName: string;
  size: "Small" | "Medium" | "Large";
  quantity: number;
  addOns: string[];
};

const sizeAdjustments = { Small: -0.5, Medium: 0, Large: 0.75 } as const;

async function serializeOrder(
  database: Pool | PoolClient,
  order: orders.InternalOrder
) {
  const items = await orders.listOrderItems(database, order.id);
  return {
    id: order.public_id,
    status: order.status,
    total: Number(order.total),
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((item) => ({
      id: item.id,
      productName: item.product_name,
      size: item.size,
      unitPrice: Number(item.unit_price),
      quantity: item.quantity,
      createdAt: item.created_at,
      addOns: item.add_ons.map(
        (addOn: { id: number; name: string; price: string }) => ({
          ...addOn,
          price: Number(addOn.price),
        })
      ),
    })),
  };
}

async function requirePendingOrder(
  client: PoolClient,
  publicId: string,
  accessToken: string
) {
  const order = await orders.findOwnedOrder(client, publicId, accessToken, true);
  if (!order) throw new AppError(404, "Order not found", "ORDER_NOT_FOUND");
  if (order.status !== "pending") {
    throw new AppError(409, "Only pending orders can be changed", "ORDER_LOCKED");
  }
  return order;
}

async function resolvePricing(client: PoolClient, input: ItemInput) {
  const menuItem = await orders.findMenuItem(client, input.productName);
  if (!menuItem) {
    throw new AppError(
      400,
      "Menu item is unavailable or invalid",
      "MENU_ITEM_NOT_FOUND"
    );
  }
  const requestedAddOns = [...new Set(input.addOns)];
  const addOns = await orders.findAddOns(client, requestedAddOns);
  if (addOns.length !== requestedAddOns.length) {
    throw new AppError(
      400,
      "Add-on is unavailable or invalid",
      "ADD_ON_NOT_FOUND"
    );
  }
  return {
    menuItem,
    addOns,
    unitPrice: Number(menuItem.base_price) + sizeAdjustments[input.size],
  };
}

async function withTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await requireDatabase().connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function createOrder() {
  const database = requireDatabase();
  const publicId = randomUUID();
  const accessToken = randomUUID();
  const order = await orders.createOrderRecord(database, publicId, accessToken);
  return { ...(await serializeOrder(database, order)), accessToken };
}

export async function getOrder(publicId: string, accessToken: string) {
  const database = requireDatabase();
  const order = await orders.findOwnedOrder(database, publicId, accessToken);
  return order ? serializeOrder(database, order) : null;
}

export async function updateOrderStatus(
  publicId: string,
  accessToken: string,
  nextStatus: OrderStatus
) {
  const order = await withTransaction(async (client) => {
    const current = await orders.findOwnedOrder(client, publicId, accessToken, true);
    if (!current) throw new AppError(404, "Order not found", "ORDER_NOT_FOUND");
    if (current.status !== "pending" || nextStatus === "pending") {
      throw new AppError(
        409,
        "Invalid order status transition",
        "INVALID_STATUS_TRANSITION"
      );
    }
    if (nextStatus === "paid") {
      if (!(await orders.orderHasItems(client, current.id))) {
        throw new AppError(409, "An empty order cannot be paid", "EMPTY_ORDER");
      }
      await orders.recalculateOrderTotal(client, current.id);
    }
    return orders.updateOrderStatusRecord(client, current.id, nextStatus);
  });
  return serializeOrder(requireDatabase(), order);
}

export function deleteOrder(publicId: string, accessToken: string) {
  return orders.deletePendingOrder(requireDatabase(), publicId, accessToken);
}

export async function addOrderItem(
  publicId: string,
  accessToken: string,
  input: ItemInput
) {
  const order = await withTransaction(async (client) => {
    const current = await requirePendingOrder(client, publicId, accessToken);
    const pricing = await resolvePricing(client, input);
    const itemId = await orders.insertOrderItem(client, {
      orderId: current.id,
      menuItemId: pricing.menuItem.id,
      productName: pricing.menuItem.name,
      size: input.size,
      unitPrice: pricing.unitPrice,
      quantity: input.quantity,
    });
    await orders.replaceItemAddOns(client, itemId, pricing.addOns);
    await orders.recalculateOrderTotal(client, current.id);
    return orders.findOwnedOrder(client, publicId, accessToken);
  });
  return serializeOrder(requireDatabase(), order!);
}

export async function updateOrderItem(
  publicId: string,
  accessToken: string,
  itemId: number,
  input: ItemInput
) {
  const order = await withTransaction(async (client) => {
    const current = await requirePendingOrder(client, publicId, accessToken);
    const pricing = await resolvePricing(client, input);
    const updated = await orders.updateOrderItemRecord(client, {
      itemId,
      orderId: current.id,
      menuItemId: pricing.menuItem.id,
      productName: pricing.menuItem.name,
      size: input.size,
      unitPrice: pricing.unitPrice,
      quantity: input.quantity,
    });
    if (!updated) {
      throw new AppError(404, "Order item not found", "ORDER_ITEM_NOT_FOUND");
    }
    await orders.replaceItemAddOns(client, itemId, pricing.addOns);
    await orders.recalculateOrderTotal(client, current.id);
    return orders.findOwnedOrder(client, publicId, accessToken);
  });
  return serializeOrder(requireDatabase(), order!);
}

export async function deleteOrderItem(
  publicId: string,
  accessToken: string,
  itemId: number
) {
  const order = await withTransaction(async (client) => {
    const current = await requirePendingOrder(client, publicId, accessToken);
    const deleted = await orders.deleteOrderItemRecord(client, current.id, itemId);
    if (!deleted) {
      throw new AppError(404, "Order item not found", "ORDER_ITEM_NOT_FOUND");
    }
    await orders.recalculateOrderTotal(client, current.id);
    return orders.findOwnedOrder(client, publicId, accessToken);
  });
  return serializeOrder(requireDatabase(), order!);
}
