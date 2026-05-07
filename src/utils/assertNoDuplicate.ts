import { AppError } from "../common/errors/app-error";

type FindUniqueDelegate<Where, Row> = {
  findUnique(args: { where: Where }): Promise<Row | null>;
};

/**
 * Runs findUnique on a unique `where`; if a row exists, throws AppError (default 409).
 */
export async function assertNoDuplicate<Where, Row>(
  delegate: FindUniqueDelegate<Where, Row>,
  where: Where,
  conflictMessage: string,
  statusCode = 409,
): Promise<void> {
  const existing = await delegate.findUnique({ where });
  if (existing) {
    throw new AppError(conflictMessage, statusCode);
  }
}
