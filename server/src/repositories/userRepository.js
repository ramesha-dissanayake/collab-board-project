import mongoose from "mongoose";

import {
  User,
} from "../models/User.js";

function normalizeEmail(email) {
  return email
    .trim()
    .toLowerCase();
}

export const userRepository = {
  async findByEmail(email) {
    return User.findOne({
      email: normalizeEmail(email),
    });
  },

  async findByEmailWithPassword(email) {
    return User.findOne({
      email: normalizeEmail(email),
    }).select("+passwordHash");
  },

  async findById(id) {
    if (
      !mongoose.isValidObjectId(id)
    ) {
      return null;
    }

    return User.findById(id);
  },

  async create({
    name,
    email,
    passwordHash,
  }) {
    return User.create({
      name,
      email:
        normalizeEmail(email),
      passwordHash,
    });
  },
};

export function publicUser(user) {
  if (!user) {
    return null;
  }

  const value =
    typeof user.toJSON ===
    "function"
      ? user.toJSON()
      : user;

  return {
    id:
      value.id ??
      value._id?.toString(),

    name:
      value.name,

    email:
      value.email,

    createdAt:
      value.createdAt,

    updatedAt:
      value.updatedAt,
  };
}