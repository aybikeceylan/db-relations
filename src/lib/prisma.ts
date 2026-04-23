import { PrismaClient } from "@prisma/client";

/**
 * Prisma client instance
 * This is a singleton instance of the Prisma client
 * It is used to connect to the database and execute queries
 * It is also used to disconnect from the database
 * It is also used to execute transactions
 * It is also used to execute batch operations
 * It is also used to execute bulk operations
 * It is also used to execute bulk operations
 */
export const prisma = new PrismaClient();
