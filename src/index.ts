/**
 * Import the dotenv package
 * This is used to load the environment variables from the .env file
 */
import "dotenv/config";

import express from "express";
import { prisma } from "./lib/prisma";

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
const app = express();

/**
 * Port number
 * This is the port number that the server will listen on
 * Port number may be invalid, so we need to validate it
 * If it is invalid, we use the default port number
 *Reason: 
  .env file's port may be empty, may be not a number, may be an invalid value
  So we need to validate it and use the default port number (3000) if it is invalid
 */
const rawPort = Number(process.env.PORT) || 3000;
const port = Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 3000;

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
    message: "Server is running",
  });
});

/**
 * Health check route
 * This is the health check route of the server
 * It is used to check if the server is healthy
 * It is also used to check if the database is connected
 * It is also used to check if the server is running
 * It is also used to check if the database is connected
 * Reason:
 * It is a very light query
 * It does not request data
 * It only tests the database connection
 * Why 200?
 * Because everything is good and the database is connected.
 * Why 503?
 * Because the service is up but the dependent database is not accessible.
 * So the system is not fully healthy and the database is not connected.
 * */

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      ok: true,
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed", error);
    res.status(503).json({
      ok: false,
      database: "disconnected",
    });
  }
});

async function startServer() {
  /**
   * Check if the DATABASE_URL is missing
   */
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }
  /**
   * Connect to the database
   * before opening the server, we need to connect to the database
   */
  await prisma.$connect();

  /**
   * Start the server
   * after connecting to the database, we can start the server
   */
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  /**
   * Shutdown function !graceful shutdown!
   * This function is used to shutdown the server
   * It is used to disconnect from the database
   * It is also used to close the server
   * @param signal is the signal received from the operating system
   */

  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);

    server.close(async () => {
      await prisma.$disconnect();
      console.log("Database disconnected");
      /**
       * Exit the process with code 0
       * This means the process exited successfully
       */
      process.exit(0);
    });
  };
  /**
   * Shutdown the server when the process is interrupted
   * It is used to disconnect from the database
   * It is also used to close the server
      * SIGINT → user interrupt Ctrl + C 
   * @param signal is the signal received from the operating system


   */
  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  /**
   * Shutdown the server when the process is terminated
   * It is used to disconnect from the database
   * It is also used to close the server
   * SIGTERM → external termination
   * @param signal is the signal received from the operating system
   */
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

/**
 * Start the server
 * If the server fails to start, it will disconnect from the database and exit the process with code 1
 */
void startServer().catch(async (error) => {
  console.error("Failed to start server:", error);
  await prisma.$disconnect();
  process.exit(1);
});
