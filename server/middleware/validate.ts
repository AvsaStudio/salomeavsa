import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType): RequestHandler {
  return (request, response, next) => {
    try {
      response.locals.validatedBody = schema.parse(request.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams(schema: ZodType): RequestHandler {
  return (request, response, next) => {
    try {
      response.locals.validatedParams = schema.parse(request.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}
