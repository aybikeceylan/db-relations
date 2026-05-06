import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import pg from "pg";

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

const pool = new pg.Pool({ connectionString: process.env["DATABASE_URL"] });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
