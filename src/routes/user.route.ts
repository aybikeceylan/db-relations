import { Router } from "express";
import {
  createUserController,
  deleteUserAvatarController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  hardDeleteUserController,
  restoreUserController,
  softDeletedUsersController,
  updateUserAvatarController,
  updateUserController,
} from "../controllers/user.controller";
import { asyncHandler } from "../common/helpers/async-handler";
import { upload } from "../middlewares/upload.middleware";
import { validateBody } from "../schemas/body.validate.schemas";
import { validateAvatarMiddleware } from "../schemas/file.validate.schemas";
import { createUserSchema, updateUserSchema } from "../schemas/user.schemas";

export const userRouter = Router();

userRouter.post(
  "/",
  upload.single("avatar"),
  validateAvatarMiddleware,
  validateBody(createUserSchema),
  asyncHandler(createUserController),
);

userRouter.get("/", asyncHandler(getUsersController));
userRouter.get("/:id", asyncHandler(getUserByIdController));
userRouter.put(
  "/:id",
  upload.single("avatar"),
  validateAvatarMiddleware,
  validateBody(updateUserSchema),
  asyncHandler(updateUserController),
);

userRouter.delete("/:id/permanent", asyncHandler(hardDeleteUserController));
userRouter.delete("/:id", asyncHandler(deleteUserController));
userRouter.delete("/:id/avatar", asyncHandler(deleteUserAvatarController));
userRouter.put(
  "/:id/avatar",
  upload.single("avatar"),
  validateAvatarMiddleware,
  asyncHandler(updateUserAvatarController),
);

userRouter.put("/:id/restore", asyncHandler(restoreUserController));
userRouter.get("/soft-deleted", asyncHandler(softDeletedUsersController));
