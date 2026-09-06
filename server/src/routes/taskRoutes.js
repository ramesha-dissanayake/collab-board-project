import {
  Router,
} from "express";

import * as taskController
  from "../controllers/taskController.js";

import {
  authenticate,
} from "../middleware/authenticate.js";

import {
  validate,
} from "../middleware/validate.js";

import {
  asyncHandler,
} from "../middleware/asyncHandler.js";

import {
  validateObjectIdParam,
} from "../middleware/validateObjectIdParam.js";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../schemas/taskSchema.js";

const router =
  Router();

router.use(
  authenticate
);

router.post(
  "/",

  validate(
    createTaskSchema
  ),

  asyncHandler(
    taskController.create
  )
);

router.patch(
  "/:id",

  validateObjectIdParam(
    "id",
    "Task"
  ),

  validate(
    updateTaskSchema
  ),

  asyncHandler(
    taskController.update
  )
);

router.delete(
  "/:id",

  validateObjectIdParam(
    "id",
    "Task"
  ),

  asyncHandler(
    taskController.remove
  )
);

export default router;