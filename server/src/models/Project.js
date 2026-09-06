import mongoose from "mongoose";

function currentMonth() {
  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
    }
  ).format(new Date());
}

const projectSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
      },

      description: {
        type: String,
        trim: true,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "Ongoing",
          "Completed",
        ],
        default: "Ongoing",
      },

      startedMonth: {
        type: String,
        trim: true,
        default: currentMonth,
      },

      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      ownerId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      memberIds: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,

          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

projectSchema.set(
  "toJSON",
  {
    versionKey: false,

    transform(_doc, ret) {
      ret.id =
        ret._id.toString();

      ret.ownerId =
        ret.ownerId?.toString();

      ret.memberIds =
        (
          ret.memberIds ?? []
        ).map(
          (memberId) =>
            memberId.toString()
        );

      delete ret._id;

      return ret;
    },
  }
);

export const Project =
  mongoose.model(
    "Project",
    projectSchema
  );