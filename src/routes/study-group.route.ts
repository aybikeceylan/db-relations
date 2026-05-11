import { Router } from "express";
import { createStudyGroupController } from "../controllers/study-group.controller";
import { asyncHandler } from "../common/helpers/async-handler";
import { validateBody } from "../schemas/body.validate.schemas";
import { createStudyGroupSchema } from "../schemas/study-group.schemas";
import { validateAvatarMiddleware } from "../schemas/file.validate.schemas";
import { upload } from "../middlewares/upload.middleware";

export const studyGroupRouter = Router();

studyGroupRouter.post(
  "/",
  upload.single("avatar"),
  validateAvatarMiddleware,
  validateBody(createStudyGroupSchema),
  asyncHandler(createStudyGroupController),
);
