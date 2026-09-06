import {
  Router,
} from "express";

import * as projectController
  from "../controllers/projectController.js";

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
  addProjectMemberSchema,
  createProjectSchema,
  memberCandidateQuerySchema,
} from "../schemas/projectSchema.js";

import {
  taskQuerySchema,
} from "../schemas/taskSchema.js";

const router =
  Router();

router.use(
  authenticate
);

router.get(
  "/",
  asyncHandler(
    projectController.list
  )
);

router.post(
  "/",
  validate(
    createProjectSchema
  ),
  asyncHandler(
    projectController.create
  )
);

router.get(
  "/:id/member-candidate",

  validateObjectIdParam(
    "id",
    "Project"
  ),

  validate(
    memberCandidateQuerySchema,
    "query"
  ),

  asyncHandler(
    projectController
      .findMemberCandidate
  )
);

router.post(
  "/:id/members",

  validateObjectIdParam(
    "id",
    "Project"
  ),

  validate(
    addProjectMemberSchema
  ),

  asyncHandler(
    projectController.addMember
  )
);

router.delete(
  "/:id/members/:memberId",

  validateObjectIdParam(
    "id",
    "Project"
  ),

  validateObjectIdParam(
    "memberId",
    "User"
  ),

  asyncHandler(
    projectController.removeMember
  )
);

router.get(
  "/:projectId/stats/overdue",

  validateObjectIdParam(
    "projectId",
    "Project"
  ),

  asyncHandler(
    taskController.overdueStats
  )
);

router.get(
  "/:projectId/tasks",

  validateObjectIdParam(
    "projectId",
    "Project"
  ),

  validate(
    taskQuerySchema,
    "query"
  ),

  asyncHandler(
    taskController.listForProject
  )
);

router.get(
  "/:id",

  validateObjectIdParam(
    "id",
    "Project"
  ),

  asyncHandler(
    projectController.getOne
  )
);

export default router;