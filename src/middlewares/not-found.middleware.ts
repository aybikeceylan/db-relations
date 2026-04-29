import { NextFunction, Request, Response } from "express";

/**
 * Not found middleware
 * This middleware is used to handle the 404 error
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * It is used to pass the error to the error handling middleware
 * The error handling middleware will handle the error and return the error response
 */
export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = new Error(`Route ${req.originalUrl} not found`);
  next(error);
}
