import type { Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import * as orderService from "../services/orderService.js";

type OrderParams = { orderId: string; itemId?: number };

function context(response: Response) {
  return {
    params: response.locals.validatedParams as OrderParams,
    body: response.locals.validatedBody,
    token: response.locals.orderAccessToken as string,
  };
}

export async function createOrder(_request: Request, response: Response) {
  response.status(201).json(await orderService.createOrder());
}

export async function getOrder(_request: Request, response: Response) {
  const { params, token } = context(response);
  const order = await orderService.getOrder(params.orderId, token);
  if (!order) throw new AppError(404, "Order not found", "ORDER_NOT_FOUND");
  response.json(order);
}

export async function updateOrder(_request: Request, response: Response) {
  const { params, body, token } = context(response);
  response.json(
    await orderService.updateOrderStatus(params.orderId, token, body.status)
  );
}

export async function deleteOrder(_request: Request, response: Response) {
  const { params, token } = context(response);
  const deleted = await orderService.deleteOrder(params.orderId, token);
  if (!deleted) throw new AppError(404, "Order not found", "ORDER_NOT_FOUND");
  response.status(204).end();
}

export async function addOrderItem(_request: Request, response: Response) {
  const { params, body, token } = context(response);
  response
    .status(201)
    .json(await orderService.addOrderItem(params.orderId, token, body));
}

export async function updateOrderItem(_request: Request, response: Response) {
  const { params, body, token } = context(response);
  response.json(
    await orderService.updateOrderItem(
      params.orderId,
      token,
      params.itemId!,
      body
    )
  );
}

export async function deleteOrderItem(_request: Request, response: Response) {
  const { params, token } = context(response);
  response.json(
    await orderService.deleteOrderItem(params.orderId, token, params.itemId!)
  );
}
