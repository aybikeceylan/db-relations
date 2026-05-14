import { Router } from "express";
import { asyncHandler } from "../common/helpers/async-handler";
import {
  createTaskController,
  getTaskByIdController,
  getTasksByStudyGroupIdController,
  updateTaskController,
  deleteTaskController,
} from "../controllers/task.controller";
import { validateBody } from "../schemas/body.validate.schemas";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../schemas/task.validate.schemas";

export const taskRouter = Router();

taskRouter.get(
  "/study-group/:studyGroupId",
  asyncHandler(getTasksByStudyGroupIdController),
);

taskRouter.post(
  "/",
  validateBody(createTaskSchema),
  asyncHandler(createTaskController),
);
taskRouter.get("/:id", asyncHandler(getTaskByIdController));

taskRouter.put(
  "/:id",
  validateBody(updateTaskSchema),
  asyncHandler(updateTaskController),
);
taskRouter.delete("/:id", asyncHandler(deleteTaskController));
