import { AppError } from "../common/errors/app-error";

export type FindUniqueByIdDelegate<T> = {
  findUnique(args: { where: { id: number } }): Promise<T | null>;
};

export async function findOneItem<T>(
  delegate: FindUniqueByIdDelegate<T>,
  id: number,
  notFoundMessage: string,
  statusCode = 404,
): Promise<T> {
  const item = await delegate.findUnique({ where: { id } });
  if (!item) {
    throw new AppError(notFoundMessage, statusCode);
  }
  return item;
}
