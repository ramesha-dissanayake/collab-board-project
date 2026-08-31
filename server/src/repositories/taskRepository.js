import { randomUUID } from "node:crypto";
import { tasks } from "../data/tasks.js";

export const taskRepository = {
  async findByProjectId(projectId) {
    return tasks.filter((task) => task.projectId === projectId);
  },

  async findById(id) {
    return tasks.find((task) => task.id === id) ?? null;
  },

  async create(data) {
    const now = new Date().toISOString();

    const task = {
      id: randomUUID(),
      projectId: data.projectId,
      title: data.title,
      description: data.description ?? "",
      status: data.status ?? "todo",
      assignee: data.assignee ?? "",
      priority: data.priority ?? "normal",
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(task);

    return task;
  },

  async update(id, changes) {
    const task = tasks.find((item) => item.id === id);

    if (!task) return null;

    Object.assign(task, changes, {
      updatedAt: new Date().toISOString(),
    });

    return task;
  },

  async remove(id) {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) return false;

    tasks.splice(index, 1);

    return true;
  },
};