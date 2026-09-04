import process from "node:process";

import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { config } from "./config.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

const app = express();

const mongooseStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
  99: "uninitialized",
};

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);

app.use(express.json());

app.get(
  "/api/health",
  (req, res) => {
    const readyState =
      mongoose.connection.readyState;

    res.json({
      status: "ok",
      service:
        "CollabBoard API",
      uptime:
        process.uptime(),

      database: {
        status:
          mongooseStates[
            readyState
          ] ?? "unknown",

        readyState,

        name:
          mongoose.connection
            .name ?? null,
      },
    });
  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  notFoundHandler
);

app.use(
  errorHandler
);

export default app;