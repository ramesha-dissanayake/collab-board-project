import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  config,
} from "../config.js";

import {
  publicUser,
  userRepository,
} from "../repositories/userRepository.js";

export async function register({
  name,
  email,
  password,
}) {
  const cleanName =
    name?.trim();

  const cleanEmail =
    email
      ?.trim()
      .toLowerCase();

  if (
    !cleanName ||
    !cleanEmail ||
    !password
  ) {
    return {
      error:
        "Name, email and password are required",
      status: 400,
    };
  }

  if (
    !cleanEmail.includes("@")
  ) {
    return {
      error:
        "A valid email address is required",
      status: 400,
    };
  }

  if (
    password.length < 6
  ) {
    return {
      error:
        "Password must be at least 6 characters",
      status: 400,
    };
  }

  const existingUser =
    await userRepository.findByEmail(
      cleanEmail
    );

  if (existingUser) {
    return {
      error:
        "An account with this email already exists",
      status: 409,
    };
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      10
    );

  try {
    const user =
      await userRepository.create({
        name:
          cleanName,

        email:
          cleanEmail,

        passwordHash,
      });

    return {
      user:
        publicUser(user),
    };
  } catch (error) {
    if (
      error?.code === 11000
    ) {
      return {
        error:
          "An account with this email already exists",
        status: 409,
      };
    }

    throw error;
  }
}

export async function login({
  email,
  password,
}) {
  const cleanEmail =
    email
      ?.trim()
      .toLowerCase();

  if (
    !cleanEmail ||
    !password
  ) {
    return {
      error:
        "Email and password are required",
      status: 400,
    };
  }

  const user =
    await userRepository
      .findByEmailWithPassword(
        cleanEmail
      );

  if (!user) {
    return {
      error:
        "Invalid email or password",
      status: 401,
    };
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordMatches) {
    return {
      error:
        "Invalid email or password",
      status: 401,
    };
  }

  const token =
    jwt.sign(
      {
        sub:
          user.id,

        email:
          user.email,
      },
      config.jwtSecret,
      {
        expiresIn:
          "1h",
      }
    );

  return {
    token,
    user:
      publicUser(user),
  };
}

export async function getCurrentUser(
  userId
) {
  const user =
    await userRepository.findById(
      userId
    );

  if (!user) {
    return {
      error:
        "Authenticated user not found",
      status: 401,
    };
  }

  return {
    user:
      publicUser(user),
  };
}