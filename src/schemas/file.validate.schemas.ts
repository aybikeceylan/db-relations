import type { Request, Response, NextFunction } from "express";
import { AppError } from "../common/errors/app-error";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export function validateAvatarMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const file = req.file;

  if (!file) {
    return next();
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new AppError("Avatar must be a JPG, PNG, or WEBP image", 400);
  }

  next();
}
