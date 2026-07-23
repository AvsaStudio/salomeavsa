import { Router } from "express";
import * as controller from "../controllers/orderController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireOrderToken } from "../middleware/orderAuth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import {
  orderItemParamsSchema,
  orderItemSchema,
  orderParamsSchema,
  updateOrderSchema,
} from "../schemas/orders.js";

export const ordersRouter = Router();

ordersRouter.post("/", asyncHandler(controller.createOrder));

ordersRouter.use("/:orderId", requireOrderToken);

ordersRouter.get(
  "/:orderId",
  validateParams(orderParamsSchema),
  asyncHandler(controller.getOrder)
);
ordersRouter.patch(
  "/:orderId",
  validateParams(orderParamsSchema),
  validateBody(updateOrderSchema),
  asyncHandler(controller.updateOrder)
);
ordersRouter.delete(
  "/:orderId",
  validateParams(orderParamsSchema),
  asyncHandler(controller.deleteOrder)
);
ordersRouter.post(
  "/:orderId/items",
  validateParams(orderParamsSchema),
  validateBody(orderItemSchema),
  asyncHandler(controller.addOrderItem)
);
ordersRouter.patch(
  "/:orderId/items/:itemId",
  validateParams(orderItemParamsSchema),
  validateBody(orderItemSchema),
  asyncHandler(controller.updateOrderItem)
);
ordersRouter.delete(
  "/:orderId/items/:itemId",
  validateParams(orderItemParamsSchema),
  asyncHandler(controller.deleteOrderItem)
);
