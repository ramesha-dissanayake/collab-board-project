import { Router } from "express";

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
  addProjectMemberSchema,
  createProjectSchema,
  memberCandidateQuerySchema,
} from "../schemas/projectSchema.js";

const router = Router();

router.use(authenticate);

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
  validate(
    memberCandidateQuerySchema,
    "query"
  ),
  asyncHandler(
    projectController.findMemberCandidate
  )
);

router.post(
  "/:id/members",
  validate(
    addProjectMemberSchema
  ),
  asyncHandler(
    projectController.addMember
  )
);

router.delete(
  "/:id/members/:memberId",
  asyncHandler(
    projectController.removeMember
  )
);

router.get(
  "/:projectId/tasks",
  asyncHandler(
    taskController.listForProject
  )
);

router.get(
  "/:id",
  asyncHandler(
    projectController.getOne
  )
);

export default router;