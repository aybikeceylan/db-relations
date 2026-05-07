import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/errors/app-error";

/**
 * Global error handling middleware
 * This middleware catches all errors thrown in the application
 * IMPORTANT: Must have 4 parameters, otherwise Express will NOT treat it as an error middleware
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  /**
   * Check if the error is a controlled (operational) error
   * We use instanceof to detect our custom AppError
   */
  if (err instanceof AppError) {
    /**
     * Return the custom status code and message
     * These are intentionally defined by the developer
     */
    return res.status(err.statusCode).json({
      status: err.statusCode,
      success: false,
      message: err.message,
    });
  }
  /**
   * If the error is NOT an AppError,
   * it is considered an unexpected (non-operational) error
   * We log it for debugging purposes
   */
  console.error(err);

  /**
   * Return a generic error response
   * We do NOT expose internal details to the client
   */
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
