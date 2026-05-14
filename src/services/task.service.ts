import { AppError } from "../common/errors/app-error";
import { prisma } from "../lib/prisma";
import { findOneItem } from "../utils/findOneItem";

export type CreateTaskParams = {
  title: string;
  description?: string;
  dueDate?: Date;
  studyGroupId: number;
  assignees: {
    userId: number;
  }[];
};
export type UpdateTaskParams = {
  title?: string;
  description?: string;
  dueDate?: Date;
  assignees?: {
    userId: number;
  }[];
};

export const createTask = async (input: CreateTaskParams) => {
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        dueDate: input.dueDate ?? null,
        studyGroupId: input.studyGroupId,
      },
    });
    await tx.taskAssignee.createMany({
      data: input.assignees.map((assignee) => ({
        taskId: task.id,
        userId: assignee.userId,
      })),
    });
    return task;
  });
};

export const getTaskById = async (id: number) => {
  return findOneItem(prisma.task, id, "Task not found");
};

export const getTasksByStudyGroupId = async (studyGroupId: number) => {
  return prisma.task.findMany({
    where: {
      studyGroupId,
    },
    include: {
      assignees: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateTask = async (id: number, input: UpdateTaskParams) => {
  await findOneItem(prisma.task, id, "Task not found");
  const assignees = input.assignees ?? [];
  const assigneeIds = assignees.map((assignee) => assignee.userId);

  if (new Set(assigneeIds).size !== assigneeIds.length) {
    throw new AppError("Duplicate assignees are not allowed", 400);
  }
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.update({
      where: { id },
      data: {
        ...(input.title ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
      },
    });
    if (input.assignees && input.assignees.length > 0) {
      await tx.taskAssignee.deleteMany({
        where: { taskId: id },
      });
      await tx.taskAssignee.createMany({
        data: input?.assignees?.map((assignee) => ({
          taskId: id,
          userId: assignee.userId,
        })),
      });
    }
    return task;
  });
};

export const deleteTask = async (id: number) => {
  await findOneItem(prisma.task, id, "Task not found");
  return prisma.task.delete({
    where: { id },
  });
};
