import { Router } from "express";
import { chat } from "../controllers/chatController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validateBody } from "../middleware/validate.js";
import { chatRequestSchema } from "../schemas/chat.js";

export const chatRouter = Router();

chatRouter.post("/", validateBody(chatRequestSchema), asyncHandler(chat));
