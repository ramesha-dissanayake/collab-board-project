import { randomUUID } from "node:crypto";
import { projects } from "../data/projects.js";

export const projectRepository = {
  async findAll() {
    return projects;
  },

  async findById(id) {
    return projects.find((project) => project.id === id) ?? null;
  },

  async create(data) {
    const project = {
      id: randomUUID(),
      name: data.name,
      description: data.description ?? "",
      status: data.status ?? "Ongoing",
      startedMonth: data.startedMonth ?? "",
      progress: 0,
      members: [],
      memberIds: [data.ownerId],
      ownerId: data.ownerId,
      createdAt: new Date().toISOString(),
    };

    projects.push(project);

    return project;
  },
};