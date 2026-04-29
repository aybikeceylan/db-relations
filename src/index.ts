/**
 * Import the dotenv package
 * This is used to load the environment variables from the .env file
 */
import "dotenv/config";

import { prisma } from "./lib/prisma";
import { app } from "./app";

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

/**
 * Entry point of the application
 * This file is responsible for:
 * - loading environment variables
 * - connecting to the database
 * - starting the HTTP server
 */
