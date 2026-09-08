import mongoose from "mongoose";

import {
  Task,
} from "../models/Task.js";

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

function toTask(task) {
  if (!task) {
    return null;
  }

  const value =
    typeof task.toObject ===
    "function"
      ? task.toObject()
      : task;

  return {
    id:
      toId(
        value._id ??
          value.id
      ),

    projectId:
      toId(
        value.projectId
      ),

    title:
      value.title,

    description:
      value.description ?? "",

    status:
      value.status ?? "todo",

    assignee:
      value.assignee ?? "",

    assigneeId:
      toId(
        value.assigneeId
      ),

    priority:
      value.priority ??
      "normal",

    dueDate:
      toIso(
        value.dueDate
      ),

    position:
      value.position ?? 0,

    version:
      value.version ?? 0,

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

export const taskRepository = {
  async findByProjectId(
    projectId
  ) {
    if (
      !mongoose.isValidObjectId(
        projectId
      )
    ) {
      return [];
    }

    const tasks =
      await Task.find({
        projectId,
      })
        .sort({
          position: 1,
          createdAt: 1,
        })
        .lean();

    return tasks.map(
      toTask
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

    const task =
      await Task.findById(
        id
      ).lean();

    return toTask(
      task
    );
  },

  async create(data) {
    const task =
      await Task.create({
        projectId:
          data.projectId,

        title:
          data.title,

        description:
          data.description ?? "",

        status:
          data.status ?? "todo",

        assignee:
          data.assignee ?? "",

        assigneeId:
          data.assigneeId ?? null,

        priority:
          data.priority ??
          "normal",

        dueDate:
          data.dueDate ?? null,

        position:
          data.position ?? 0,

        version:
          data.version ?? 0,
      });

    return toTask(
      task
    );
  },

  async updateWithVersion(
    id,
    changes,
    baseVersion
  ) {
    if (
      !mongoose.isValidObjectId(
        id
      )
    ) {
      return null;
    }

    const task =
      await Task.findOneAndUpdate(
        {
          _id: id,
          version:
            baseVersion,
        },

        {
          $set:
            changes,

          $inc: {
            version: 1,
          },
        },

        {
          new: true,
          runValidators: true,
        }
      ).lean();

    return toTask(
      task
    );
  },

  async remove(id) {
    if (
      !mongoose.isValidObjectId(
        id
      )
    ) {
      return false;
    }

    const task =
      await Task.findByIdAndDelete(
        id
      );

    return Boolean(task);
  },

  async aggregateOverdueByAssignee(
    projectId
  ) {
    if (
      !mongoose.isValidObjectId(
        projectId
      )
    ) {
      return [];
    }

    const results =
      await Task.aggregate([
        {
          $match: {
            projectId:
              new mongoose.Types.ObjectId(
                projectId
              ),

            dueDate: {
              $ne: null,
              $lt: new Date(),
            },

            status: {
              $ne: "done",
            },
          },
        },

        {
          $group: {
            _id:
              "$assigneeId",

            overdueCount: {
              $sum: 1,
            },
          },
        },

        {
          $lookup: {
            from:
              "users",

            localField:
              "_id",

            foreignField:
              "_id",

            as:
              "assignee",
          },
        },

        {
          $unwind: {
            path:
              "$assignee",

            preserveNullAndEmptyArrays:
              true,
          },
        },

        {
          $project: {
            _id: 0,

            assigneeId: {
              $convert: {
                input:
                  "$_id",

                to:
                  "string",

                onError:
                  null,

                onNull:
                  null,
              },
            },

            assigneeName: {
              $ifNull: [
                "$assignee.name",
                "Unassigned",
              ],
            },

            overdueCount:
              1,
          },
        },

        {
          $sort: {
            overdueCount:
              -1,

            assigneeName:
              1,
          },
        },
      ]);

    return results;
  },
};