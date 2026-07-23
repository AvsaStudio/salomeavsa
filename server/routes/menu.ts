import { Router } from "express";
import { menu } from "../controllers/menuController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const menuRouter = Router();
menuRouter.get("/", asyncHandler(menu));
