/**
 * AppError class
 * This class is used to create a custom error from javascript Error class
 **/
export class AppError extends Error {
  /**
   * Status code
   * It holds the HTTP status code of the error
   */
  public statusCode: number;
  /**
   * Is operational
   * This is a boolean flag to indicate if the error is operational so we can distinguish between user errors and system errors
   */
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Request comes to the server

// Request passes through middlewares (logger, validation, etc.)

// Route handler (controller) runs

// If something goes wrong:
// → throw new AppError("message", statusCode)

// Express catches the thrown error

// Error is passed to the error middleware

// Error middleware checks:
// → is it AppError?
// → or unknown error?

// If AppError:
// → use statusCode and message

// If unknown error:
// → return 500 Internal Server Error

// Send standardized response to client

// End of request lifecycle
