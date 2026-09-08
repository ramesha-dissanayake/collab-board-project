import * as taskService
  from "../services/taskService.js";

export async function listForProject(
  req,
  res
) {
  const query =
    req.validated?.query ??
    {};

  const tasks =
    await taskService.listTasks(
      req.params.projectId,
      req.user.id,
      {
        status:
          query.status,

        assignee:
          query.assignee,
      }
    );

  return res
    .status(200)
    .json({
      data: tasks,
    });
}

export async function overdueStats(
  req,
  res
) {
  const stats =
    await taskService.getOverdueStats(
      req.params.projectId,
      req.user.id
    );

  return res
    .status(200)
    .json({
      data: stats,
    });
}

export async function create(
  req,
  res
) {
  const task =
    await taskService.createTask(
      req.body,
      req.user.id
    );

  return res
    .status(201)
    .json({
      data: task,
    });
}

export async function update(
  req,
  res
) {
  const {
    baseVersion,
    ...changes
  } = req.body;

  const task =
    await taskService.updateTask(
      req.params.id,
      changes,
      baseVersion,
      req.user.id
    );

  return res
    .status(200)
    .json({
      data: task,
    });
}

export async function remove(
  req,
  res
) {
  await taskService.deleteTask(
    req.params.id,
    req.user.id
  );

  return res
    .status(204)
    .end();
}