import type { Request, Response } from "express";
import type { ChatRequest } from "../schemas/chat.js";
import { generateCoffeeReply } from "../services/chatService.js";

export async function chat(_request: Request, response: Response) {
  const input = response.locals.validatedBody as ChatRequest;
  response.json({ message: await generateCoffeeReply(input) });
}
