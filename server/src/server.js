import process from "node:process";

import app from "./app.js";
import { config } from "./config.js";
import { connectDb } from "./db/connect.js";

async function startServer() {
  try {
    await connectDb();

    app.listen(
      config.port,
      () => {
        console.log(
          `CollabBoard API running at http://localhost:${config.port}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start CollabBoard API:"
    );

    console.error(
      error.message
    );

    process.exit(1);
  }
}

startServer();