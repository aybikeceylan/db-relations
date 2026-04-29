import { NextFunction, Request, Response } from "express";

/**
 * Request logger middleware
 * This middleware is used to log the request method and url
 * @param req - The request object
 * @param res - The response object (unused)
 * @param next - The next function
 */
export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`${req.method} ${req.url}`);
  next();
}
