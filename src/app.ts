import express from "express";
import { requestLoggerMiddleware } from "./middlewares/request-logger.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

/**
 * Express application
 * This is the main Express application
 * It is used to create the server and listen for requests
 * It is also used to handle the routes
 * It is also used to handle the middleware
 * It is also used to handle the error handling
 * It is also used to handle the logging
 * It is also used to handle the database connection
 * It is also used to handle the database disconnection
 */
export const app = express();

/**
 * Disable the X-Powered-By header
 * This is a security measure to prevent the server from being identified as an Express server
 */
app.disable("x-powered-by");

/**
 * Parse the request body as JSON
 * This is a middleware that parses the request body as JSON
 */
app.use(express.json());

/**
 * Request logger middleware
 * This middleware is used to log the request method and url
 */
app.use(requestLoggerMiddleware);

/**
 * Root route
 * This is the root route of the server
 * If the request is successful, it will return a JSON response with the message "Server is running"
 * This is a simple test route to check if the server is running
 * _req: request object (unused) _req is a placeholder for the request object
 * it is because we are not using the request object in this route
 * it means we are not using the request object in this route purposefully
 */
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

/**
 * Health check route
 * This is the health check route of the server
 * */

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
  });
});

/**
 * Not found middleware
 * This middleware is used to handle the 404 error for unknown routes
 */
app.use(notFoundMiddleware);

/**
 * Error middleware
 * This middleware is used to handle errors
 */
app.use(errorMiddleware);

/**
 * This file is responsible for creating and configuring the Express application.
 * It defines how the application behaves:
 * - middlewares
 * - routes
 * - request/response handling
 *
 * IMPORTANT:
 * This file does NOT start the server.
 * It only prepares the app.
 */
