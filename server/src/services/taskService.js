import { taskRepository } from "../repositories/taskRepository.js";
import { ensureProjectAccess } from "./projectService.js";
import { NotFoundError } from "../utils/AppError.js";

export async function listTasks(
  projectId,
  userId,
  { status, assignee } = {}
) {
  await ensureProjectAccess(projectId, userId);

  let tasks = await taskRepository.findByProjectId(projectId);

  if (status) {
    tasks = tasks.filter((task) => task.status === status);
  }

  if (assignee) {
    tasks = tasks.filter((task) => task.assignee === assignee);
  }

  return tasks;
}

export async function createTask(data, userId) {
  await ensureProjectAccess(data.projectId, userId);

  return taskRepository.create(data);
}

export async function updateTask(taskId, changes, userId) {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new NotFoundError("Task");
  }

  await ensureProjectAccess(task.projectId, userId);

  return taskRepository.update(taskId, changes);
}

export async function deleteTask(taskId, userId) {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new NotFoundError("Task");
  }

  await ensureProjectAccess(task.projectId, userId);

  await taskRepository.remove(taskId);
}