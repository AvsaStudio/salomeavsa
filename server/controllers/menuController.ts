import type { Request, Response } from "express";
import { getMenu } from "../services/menuService.js";

export async function menu(_request: Request, response: Response) {
  response.json(await getMenu());
}
