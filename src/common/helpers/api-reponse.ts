export type SuccessBody<T = unknown> = {
  success: true;
  message: string;
} & ([T] extends [undefined] ? { data?: never } : { data: T });

import type { Response } from "express";

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
) {
  const body =
    data === undefined
      ? { success: true as const, message }
      : { success: true as const, message, data };
  return res.status(statusCode).json(body);
}
