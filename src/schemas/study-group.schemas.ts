import { z } from "zod";

export const createStudyGroupSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  userId: z.number(),
});
