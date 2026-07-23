import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

export const requestLogger: RequestHandler = (request, response, next) => {
  const requestId = request.header("X-Request-Id") || randomUUID();
  const startedAt = performance.now();
  response.setHeader("X-Request-Id", requestId);
  response.locals.requestId = requestId;

  response.once("finish", () => {
    const duration = Math.round((performance.now() - startedAt) * 10) / 10;
    console.info(
      JSON.stringify({
        requestId,
        method: request.method,
        path: request.originalUrl,
        status: response.statusCode,
        durationMs: duration,
      })
    );
  });
  next();
};
