import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { orderAccessTokenSchema } from "../schemas/orders.js";

export const requireOrderToken: RequestHandler = (request, response, next) => {
  const result = orderAccessTokenSchema.safeParse(request.header("X-Order-Token"));
  if (!result.success) {
    next(new AppError(401, "Order access token is required", "ORDER_TOKEN_REQUIRED"));
    return;
  }
  response.locals.orderAccessToken = result.data;
  next();
};
