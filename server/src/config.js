import process from "node:process";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGODB_URI;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

if (!mongoUri) {
  throw new Error("MONGODB_URI is required");
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin:
    process.env.CLIENT_ORIGIN ??
    "http://localhost:5173",
  jwtSecret,
  mongoUri,
};