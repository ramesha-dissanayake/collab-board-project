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

// Board screen:
// find({ projectId, status }).sort({ position: 1 })
taskSchema.index({
  projectId: 1,
  status: 1,
  position: 1,
});

// Overdue task queries.
taskSchema.index({
  projectId: 1,
  dueDate: 1,
});

// "My tasks" / assignee queries.
taskSchema.index({
  assigneeId: 1,
  status: 1,
});

// Free-text task search.
taskSchema.index({
  title: "text",
  description: "text",
});

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