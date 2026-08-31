import * as taskService from "../services/taskService.js";

export async function listForProject(req, res) {
  const tasks = await taskService.listTasks(
    req.params.projectId,
    req.user.id,
    {
      status: req.query.status,
      assignee: req.query.assignee,
    }
  );

  return res.status(200).json({
    data: tasks,
  });
}

export async function create(req, res) {
  const task = await taskService.createTask(
    req.body,
    req.user.id
  );

  return res.status(201).json({
    data: task,
  });
}

export async function update(req, res) {
  const task = await taskService.updateTask(
    req.params.id,
    req.body,
    req.user.id
  );

  return res.status(200).json({
    data: task,
  });
}

export async function remove(req, res) {
  await taskService.deleteTask(
    req.params.id,
    req.user.id
  );

  return res.status(204).end();
}