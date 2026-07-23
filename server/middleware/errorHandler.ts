import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

const databaseErrorCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "28P01",
  "3D000",
  "57P01",
  "57P02",
  "57P03",
]);

function isDatabaseUnavailable(error: Error) {
  const code = "code" in error ? String(error.code) : "";
  if (databaseErrorCodes.has(code)) return true;
  return (
    error instanceof AggregateError &&
    error.errors.some(
      (nested) =>
        nested instanceof Error &&
        "code" in nested &&
        databaseErrorCodes.has(String(nested.code))
    )
  );
}

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json({ error: "API route not found" });
};

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next
) => {
  if (error instanceof ZodError) {
    response.status(400).json({ error: "Invalid request", issues: error.issues });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.status).json({
      error: error.message,
      ...(error.code ? { code: error.code } : {}),
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }
  if (error instanceof Error && error.name === "DatabaseUnavailableError") {
    response.status(503).json({ error: error.message });
    return;
  }
  if (error instanceof Error && isDatabaseUnavailable(error)) {
    response.status(503).json({ error: "PostgreSQL is unavailable" });
    return;
  }

  console.error("Unhandled API error:", error);
  response.status(500).json({ error: "Internal server error" });
};
