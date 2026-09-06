import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "todo",
        "doing",
        "done",
      ],
      default: "todo",
    },

    assignee: {
      type: String,
      trim: true,
      default: "",
    },

    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    priority: {
      type: String,
      enum: [
        "low",
        "normal",
        "high",
      ],
      default: "normal",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    position: {
      type: Number,
      min: 0,
      default: 0,
    },

    version: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.set(
  "toJSON",
  {
    versionKey: false,

    transform(_doc, ret) {
      ret.id =
        ret._id.toString();

      ret.projectId =
        ret.projectId?.toString();

      ret.assigneeId =
        ret.assigneeId
          ? ret.assigneeId.toString()
          : null;

      if (ret.dueDate) {
        ret.dueDate =
          ret.dueDate.toISOString();
      }

      delete ret._id;

      return ret;
    },
  }
);

export const Task =
  mongoose.model(
    "Task",
    taskSchema
  );