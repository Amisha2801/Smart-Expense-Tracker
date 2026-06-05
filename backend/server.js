import "dotenv/config";

import express from "express";

import { runMigrations } from "./db/migrate.js";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";
// import { configDotenv } from "dotenv";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Smart Expense Tracker API Running");
});

app.use("/api", apiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

function validateEnv() {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is required");
    process.exit(1);
  }
}

async function start() {
  try {
    validateEnv();
    await runMigrations();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
