import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  versionKey: false,

  transform(_doc, ret) {
    ret.id = ret._id.toString();

    delete ret._id;
    delete ret.passwordHash;

    return ret;
  },
});

export const User = mongoose.model(
  "User",
  userSchema
);