import { randomUUID } from "node:crypto";

import { projects } from "../data/projects.js";

export const projectRepository = {
  async findAll() {
    return projects;
  },

  async findById(id) {
    return (
      projects.find(
        (project) => project.id === id
      ) ?? null
    );
  },

  async create(data) {
    const project = {
      id: randomUUID(),

      name: data.name,

      description:
        data.description ?? "",

      status:
        data.status ?? "Ongoing",

      startedMonth:
        data.startedMonth ??
        new Intl.DateTimeFormat(
          "en",
          {
            month: "short",
          }
        ).format(new Date()),

      progress: 0,

      // Real registered users are stored here.
      memberIds: [
        data.ownerId,
      ],

      ownerId:
        data.ownerId,

      createdAt:
        new Date().toISOString(),
    };

    projects.push(project);

    return project;
  },

  async addMember(
    projectId,
    userId
  ) {
    const project =
      projects.find(
        (item) =>
          item.id === projectId
      );

    if (!project) {
      return null;
    }

    if (
      !project.memberIds.includes(
        userId
      )
    ) {
      project.memberIds.push(
        userId
      );
    }

    return project;
  },

  async removeMember(
    projectId,
    userId
  ) {
    const project =
      projects.find(
        (item) =>
          item.id === projectId
      );

    if (!project) {
      return null;
    }

    project.memberIds =
      project.memberIds.filter(
        (id) => id !== userId
      );

    return project;
  },
};