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

const dueDateSchema =
  z
    .string()
    .datetime()
    .nullable();

export const createTaskSchema =
  z.object({
    projectId:
      objectIdSchema,

    title:
      z
        .string()
        .trim()
        .min(
          3,
          "Title must be at least 3 characters"
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
          "todo",
          "doing",
          "done",
        ])
        .optional()
        .default("todo"),

    assignee:
      z
        .string()
        .trim()
        .optional()
        .default(""),

    priority:
      z
        .enum([
          "low",
          "normal",
          "high",
        ])
        .optional()
        .default("normal"),

    dueDate:
      dueDateSchema
        .optional()
        .default(null),

    position:
      z
        .number()
        .int()
        .min(0)
        .optional()
        .default(0),
  });

export const updateTaskSchema =
  z
    .object({
      baseVersion:
        z
          .number()
          .int()
          .min(0),

      title:
        z
          .string()
          .trim()
          .min(3)
          .optional(),

      description:
        z
          .string()
          .trim()
          .optional(),

      status:
        z
          .enum([
            "todo",
            "doing",
            "done",
          ])
          .optional(),

      assignee:
        z
          .string()
          .trim()
          .optional(),

      priority:
        z
          .enum([
            "low",
            "normal",
            "high",
          ])
          .optional(),

      dueDate:
        dueDateSchema
          .optional(),

      position:
        z
          .number()
          .int()
          .min(0)
          .optional(),
    })
    .refine(
      (data) =>
        Object.keys(
          data
        ).some(
          (key) =>
            key !==
            "baseVersion"
        ),

      "At least one task field must be updated"
    );

export const taskQuerySchema =
  z.object({
    status:
      z
        .enum([
          "todo",
          "doing",
          "done",
        ])
        .optional(),

    assignee:
      z
        .string()
        .trim()
        .min(1)
        .optional(),
  });