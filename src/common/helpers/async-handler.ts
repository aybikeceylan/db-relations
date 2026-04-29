import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers and forwards errors to the global error middleware.
 *
 * Without this helper, we would need to write try/catch in every async controller.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
