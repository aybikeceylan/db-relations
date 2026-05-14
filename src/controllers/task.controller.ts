import { sendSuccess } from "../common/helpers/api-reponse";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksByStudyGroupId,
  updateTask,
} from "../services/task.service";
import { Request, Response } from "express";

export async function createTaskController(req: Request, res: Response) {
  const { title, description, dueDate, studyGroupId, assignees } = req.body;
  const task = await createTask({
    title,
    description,
    dueDate,
    studyGroupId,
    assignees,
  });
  sendSuccess(res, 201, "Task created successfully", task);
}

export async function getTaskByIdController(req: Request, res: Response) {
  const { id } = req.params;
  const task = await getTaskById(Number(id));
  sendSuccess(res, 200, "Task retrieved successfully", task);
}

export async function getTasksByStudyGroupIdController(
  req: Request,
  res: Response,
) {
  const { studyGroupId } = req.params;
  const tasks = await getTasksByStudyGroupId(Number(studyGroupId));
  sendSuccess(res, 200, "Tasks retrieved successfully", tasks);
}

export async function updateTaskController(req: Request, res: Response) {
  const { id } = req.params;
  const { title, description, dueDate, assignees } = req.body;
  const task = await updateTask(Number(id), {
    title,
    description,
    dueDate,
    assignees,
  });
  sendSuccess(res, 200, "Task updated successfully", task);
}

export async function deleteTaskController(req: Request, res: Response) {
  const { id } = req.params;
  await deleteTask(Number(id));
  sendSuccess(res, 200, "Task deleted successfully");
}
