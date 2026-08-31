import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Project name is required"),
  description: z.string().trim().optional().default(""),
  status: z.enum(["Ongoing", "Completed"]).optional().default("Ongoing"),
  startedMonth: z.string().trim().optional().default(""),
});