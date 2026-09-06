import mongoose from "mongoose";

import {
  Project,
} from "../models/Project.js";

function toId(value) {
  if (value == null) {
    return null;
  }

  return value.toString();
}

function toIso(value) {
  if (!value) {
    return null;
  }

  if (
    value instanceof Date
  ) {
    return value.toISOString();
  }

  return value;
}

function toProject(project) {
  if (!project) {
    return null;
  }

  const value =
    typeof project.toObject ===
    "function"
      ? project.toObject()
      : project;

  return {
    id:
      toId(
        value._id ??
          value.id
      ),

    name:
      value.name,

    description:
      value.description ?? "",

    status:
      value.status ??
      "Ongoing",

    startedMonth:
      value.startedMonth ?? "",

    progress:
      value.progress ?? 0,

    ownerId:
      toId(
        value.ownerId
      ),

    memberIds:
      (
        value.memberIds ?? []
      ).map(toId),

    createdAt:
      toIso(
        value.createdAt
      ),

    updatedAt:
      toIso(
        value.updatedAt
      ),
  };
}

export const projectRepository = {
  async findAll() {
    const projects =
      await Project.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return projects.map(
      toProject
    );
  },

  async findById(id) {
    if (
      !mongoose.isValidObjectId(
        id
      )
    ) {
      return null;
    }

    const project =
      await Project.findById(
        id
      ).lean();

    return toProject(
      project
    );
  },

  async create(data) {
    const project =
      await Project.create({
        name:
          data.name,

        description:
          data.description ??
          "",

        status:
          data.status ??
          "Ongoing",

        startedMonth:
          data.startedMonth ||
          undefined,

        progress:
          data.progress ?? 0,

        ownerId:
          data.ownerId,

        memberIds: [
          data.ownerId,
        ],
      });

    return toProject(
      project
    );
  },

  async addMember(
    projectId,
    userId
  ) {
    if (
      !mongoose.isValidObjectId(
        projectId
      ) ||
      !mongoose.isValidObjectId(
        userId
      )
    ) {
      return null;
    }

    const project =
      await Project.findByIdAndUpdate(
        projectId,

        {
          $addToSet: {
            memberIds:
              userId,
          },
        },

        {
          new: true,
          runValidators: true,
        }
      ).lean();

    return toProject(
      project
    );
  },

  async removeMember(
    projectId,
    userId
  ) {
    if (
      !mongoose.isValidObjectId(
        projectId
      ) ||
      !mongoose.isValidObjectId(
        userId
      )
    ) {
      return null;
    }

    const project =
      await Project.findByIdAndUpdate(
        projectId,

        {
          $pull: {
            memberIds:
              userId,
          },
        },

        {
          new: true,
          runValidators: true,
        }
      ).lean();

    return toProject(
      project
    );
  },
};