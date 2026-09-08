import {
  taskRepository,
} from "../repositories/taskRepository.js";

import {
  ensureProjectAccess,
} from "./projectService.js";

import {
  ConflictError,
  NotFoundError,
} from "../utils/AppError.js";

export async function listTasks(
  projectId,
  userId,
  {
    status,
    assignee,
  } = {}
) {
  await ensureProjectAccess(
    projectId,
    userId
  );

  let tasks =
    await taskRepository.findByProjectId(
      projectId
    );

  if (status) {
    tasks =
      tasks.filter(
        (task) =>
          task.status === status
      );
  }

  if (assignee) {
    tasks =
      tasks.filter(
        (task) =>
          task.assignee ===
          assignee
      );
  }

  return tasks;
}

export async function createTask(
  data,
  userId
) {
  await ensureProjectAccess(
    data.projectId,
    userId
  );

  return taskRepository.create({
    ...data,

    assigneeId:
      userId,

    version:
      0,
  });
}

export async function updateTask(
  taskId,
  changes,
  baseVersion,
  userId
) {
  const existing =
    await taskRepository.findById(
      taskId
    );

  if (!existing) {
    throw new NotFoundError(
      "Task"
    );
  }

  await ensureProjectAccess(
    existing.projectId,
    userId
  );

  const updated =
    await taskRepository
      .updateWithVersion(
        taskId,
        changes,
        baseVersion
      );

  if (updated) {
    return updated;
  }

  const current =
    await taskRepository.findById(
      taskId
    );

  if (!current) {
    throw new NotFoundError(
      "Task"
    );
  }

  throw new ConflictError(
    "Task was modified by someone else",
    {
      current,
      yourVersion:
        baseVersion,
    }
  );
}

export async function deleteTask(
  taskId,
  userId
) {
  const task =
    await taskRepository.findById(
      taskId
    );

  if (!task) {
    throw new NotFoundError(
      "Task"
    );
  }

  await ensureProjectAccess(
    task.projectId,
    userId
  );

  await taskRepository.remove(
    taskId
  );
}

export async function getOverdueStats(
  projectId,
  userId
) {
  await ensureProjectAccess(
    projectId,
    userId
  );

  return taskRepository
    .aggregateOverdueByAssignee(
      projectId
    );
}