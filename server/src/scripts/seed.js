import process from "node:process";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import {
  connectDb,
} from "../db/connect.js";

import {
  User,
} from "../models/User.js";

import {
  Project,
} from "../models/Project.js";

import {
  Task,
} from "../models/Task.js";

function daysFromNow(days) {
  const date = new Date();

  date.setUTCDate(
    date.getUTCDate() + days
  );

  return date;
}

async function seed() {
  try {
    await connectDb();

    console.log(
      "Clearing existing seed data..."
    );

    await Task.deleteMany({});
    await Project.deleteMany({});
    await User.deleteMany({});

    console.log(
      "Creating users..."
    );

    const passwordHash =
      await bcrypt.hash(
        "password123",
        10
      );

    const [
      maya,
      ruwan,
      nimal,
    ] = await User.create([
      {
        name:
          "Maya Fernando",

        email:
          "maya.seed@example.com",

        passwordHash,
      },

      {
        name:
          "Ruwan Perera",

        email:
          "ruwan.seed@example.com",

        passwordHash,
      },

      {
        name:
          "Nimal Silva",

        email:
          "nimal.seed@example.com",

        passwordHash,
      },
    ]);

    console.log(
      "Creating projects..."
    );

    const [
      collabProject,
      campusProject,
    ] = await Project.create([
      {
        name:
          "CollabBoard M3",

        description:
          "Seeded project for MongoDB persistence and aggregation testing.",

        status:
          "Ongoing",

        progress:
          55,

        ownerId:
          maya._id,

        memberIds: [
          maya._id,
          ruwan._id,
          nimal._id,
        ],
      },

      {
        name:
          "Campus Event Planner",

        description:
          "Secondary seeded project for testing project isolation.",

        status:
          "Ongoing",

        progress:
          30,

        ownerId:
          ruwan._id,

        memberIds: [
          ruwan._id,
          maya._id,
        ],
      },
    ]);

    console.log(
      "Creating tasks..."
    );

    await Task.create([
      {
        projectId:
          collabProject._id,

        title:
          "Prepare database schema",

        description:
          "Review the M3 MongoDB data model.",

        status:
          "todo",

        priority:
          "high",

        assignee:
          maya.name,

        assigneeId:
          maya._id,

        dueDate:
          daysFromNow(-5),

        position:
          0,

        version:
          0,
      },

      {
        projectId:
          collabProject._id,

        title:
          "Review API persistence",

        description:
          "Check the MongoDB-backed REST endpoints.",

        status:
          "doing",

        priority:
          "normal",

        assignee:
          maya.name,

        assigneeId:
          maya._id,

        dueDate:
          daysFromNow(-2),

        position:
          0,

        version:
          0,
      },

      {
        projectId:
          collabProject._id,

        title:
          "Document task indexes",

        description:
          "Record the indexes used by the task collection.",

        status:
          "todo",

        priority:
          "normal",

        assignee:
          ruwan.name,

        assigneeId:
          ruwan._id,

        dueDate:
          daysFromNow(-3),

        position:
          1,

        version:
          0,
      },

      {
        projectId:
          collabProject._id,

        title:
          "Completed API review",

        description:
          "A completed overdue task that should not count as overdue.",

        status:
          "done",

        priority:
          "normal",

        assignee:
          ruwan.name,

        assigneeId:
          ruwan._id,

        dueDate:
          daysFromNow(-6),

        position:
          0,

        version:
          0,
      },

      {
        projectId:
          collabProject._id,

        title:
          "Prepare offline support",

        description:
          "Future task for the PouchDB milestone work.",

        status:
          "todo",

        priority:
          "high",

        assignee:
          nimal.name,

        assigneeId:
          nimal._id,

        dueDate:
          daysFromNow(10),

        position:
          2,

        version:
          0,
      },

      {
        projectId:
          campusProject._id,

        title:
          "Prepare event checklist",

        description:
          "Task belonging to the second seeded project.",

        status:
          "todo",

        priority:
          "normal",

        assignee:
          ruwan.name,

        assigneeId:
          ruwan._id,

        dueDate:
          daysFromNow(4),

        position:
          0,

        version:
          0,
      },
    ]);

    console.log(
      "Synchronizing indexes..."
    );

    await User.syncIndexes();
    await Project.syncIndexes();
    await Task.syncIndexes();

    console.log("");
    console.log(
      "Seed completed successfully."
    );

    console.log("");
    console.log(
      "Test accounts:"
    );

    console.log(
      "maya.seed@example.com / password123"
    );

    console.log(
      "ruwan.seed@example.com / password123"
    );

    console.log(
      "nimal.seed@example.com / password123"
    );

    console.log("");
    console.log(
      `Main seeded project ID: ${collabProject._id}`
    );
  } catch (error) {
    console.error(
      "Seed failed:"
    );

    console.error(error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();