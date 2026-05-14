import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  studyGroupId: z.number(),
  assignees: z.array(
    z.object({
      userId: z.number(),
    }),
  ),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  assignees: z
    .array(
      z.object({
        userId: z.number(),
      }),
    )
    .optional(),
});
