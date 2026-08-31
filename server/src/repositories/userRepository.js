import { randomUUID } from "node:crypto";
import { users } from "../data/users.js";

export const userRepository = {
  async findByEmail(email) {
    return (
      users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      ) ?? null
    );
  },

  async findById(id) {
    return users.find((user) => user.id === id) ?? null;
  },

  async create({ name, email, passwordHash }) {
    const user = {
      id: randomUUID(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(user);

    return user;
  },
};

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}