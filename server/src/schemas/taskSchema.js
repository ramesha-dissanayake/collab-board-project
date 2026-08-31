import { z } from "zod";

export const createTaskSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().optional().default(""),
  status: z.enum(["todo", "doing", "done"]).optional().default("todo"),
  assignee: z.string().trim().optional().default(""),
  priority: z.enum(["low", "normal", "high"]).optional().default("normal"),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(3).optional(),
    description: z.string().trim().optional(),
    status: z.enum(["todo", "doing", "done"]).optional(),
    assignee: z.string().trim().optional(),
    priority: z.enum(["low", "normal", "high"]).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be updated"
  );