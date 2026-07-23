import { z } from "zod";

export const orderIdSchema = z.uuid();
export const orderItemIdSchema = z.coerce.number().int().positive();
export const orderAccessTokenSchema = z.uuid();
export const orderStatusSchema = z.enum(["pending", "paid", "cancelled"]);
export const sizeSchema = z.enum(["Small", "Medium", "Large"]);

export const updateOrderSchema = z
  .object({ status: orderStatusSchema })
  .strict();

export const orderItemSchema = z
  .object({
    productName: z.string().trim().min(1).max(100),
    size: sizeSchema,
    quantity: z.number().int().min(1).max(20).default(1),
    addOns: z.array(z.string().trim().min(1).max(100)).max(10).default([]),
  })
  .strict();

export const orderParamsSchema = z.object({ orderId: orderIdSchema });
export const orderItemParamsSchema = z.object({
  orderId: orderIdSchema,
  itemId: orderItemIdSchema,
});
