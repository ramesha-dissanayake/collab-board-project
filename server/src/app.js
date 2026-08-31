import express from "express";
import cors from "cors";
import { config } from "./config.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CollabBoard API",
    uptime: process.uptime(),
  });
});

app.use("/api/auth", authRoutes);

export default app;