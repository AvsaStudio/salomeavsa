import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isDatabaseConfigured, pool } from "./db/pool.js";
import { asyncHandler } from "./middleware/asyncHandler.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { chatRouter } from "./routes/chat.js";
import { menuRouter } from "./routes/menu.js";
import { ordersRouter } from "./routes/orders.js";

export const app = express();

app.disable("x-powered-by");
app.use(requestLogger);
app.use(express.json({ limit: "32kb" }));

app.get(
  "/api/health",
  asyncHandler(async (_request, response) => {
    let database = isDatabaseConfigured ? "unavailable" : "not_configured";
    if (pool) {
      try {
        await pool.query("SELECT 1");
        database = "connected";
      } catch {
        database = "unavailable";
      }
    }
    response.json({ status: "ok", database });
  })
);

app.use("/api/orders", ordersRouter);
app.use("/api/menu", menuRouter);
app.use("/api/chat", chatRouter);
app.use("/api", notFoundHandler);

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const distDirectory = path.resolve(currentDirectory, "../dist");
app.use(express.static(distDirectory));
app.get("/{*splat}", (_request, response) => {
  response.sendFile(path.join(distDirectory, "index.html"));
});

app.use(errorHandler);
