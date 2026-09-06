import {
  z,
} from "zod";

const objectIdSchema =
  z
    .string()
    .trim()
    .regex(
      /^[a-f\d]{24}$/i,
      "A valid MongoDB ObjectId is required"
    );

export const createProjectSchema =
  z.object({
    name:
      z
        .string()
        .trim()
        .min(
          2,
          "Project name is required"
        ),

    description:
      z
        .string()
        .trim()
        .optional()
        .default(""),

    status:
      z
        .enum([
          "Ongoing",
          "Completed",
        ])
        .optional()
        .default("Ongoing"),

    startedMonth:
      z
        .string()
        .trim()
        .optional(),
  });

export const memberCandidateQuerySchema =
  z.object({
    email:
      z
        .string()
        .trim()
        .email(
          "A valid email is required"
        ),
  });

export const addProjectMemberSchema =
  z.object({
    memberId:
      objectIdSchema,
  });