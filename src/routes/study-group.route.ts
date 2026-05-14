import { Router } from "express";
import {
  addMemberToStudyGroupController,
  createStudyGroupController,
  deleteStudyGroupController,
  getMembersOfStudyGroupController,
  getStudyGroupByIdController,
  getStudyGroupsController,
  removeMemberFromStudyGroupController,
  updateStudyGroupAvatarController,
  updateStudyGroupController,
} from "../controllers/study-group.controller";
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

studyGroupRouter.get("/", asyncHandler(getStudyGroupsController));
studyGroupRouter.get("/:id", asyncHandler(getStudyGroupByIdController));

studyGroupRouter.put("/:id", asyncHandler(updateStudyGroupController));
studyGroupRouter.delete("/:id", asyncHandler(deleteStudyGroupController));
studyGroupRouter.put(
  "/:id/avatar",
  upload.single("avatar"),
  validateAvatarMiddleware,
  asyncHandler(updateStudyGroupAvatarController),
);

studyGroupRouter.post(
  "/:id/members",
  asyncHandler(addMemberToStudyGroupController),
);
studyGroupRouter.delete(
  "/:id/members",
  asyncHandler(removeMemberFromStudyGroupController),
);
studyGroupRouter.get(
  "/:id/members",
  asyncHandler(getMembersOfStudyGroupController),
);
