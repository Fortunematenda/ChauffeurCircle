import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { clientRouter } from "./routes/client";
import { driverRouter } from "./routes/driver";
import { healthRouter } from "./routes/health";
import { ridesRouter } from "./routes/rides";
import { adminRouter } from "./routes/admin";
import { tripRouter } from "./routes/trip";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");

  app.use(helmet());

  const raw = env.CORS_ORIGINS;
  const origin =
    raw === "*"
      ? "*"
      : raw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  app.use(
    cors({
      origin: Array.isArray(origin) && origin.length === 0 ? false : origin,
      credentials: false,
    })
  );

  app.use(express.json({ limit: "1mb" }));

  app.use("/auth", authRouter);

  app.use("/driver", driverRouter);
  app.use("/client", clientRouter);
  app.use("/rides", ridesRouter);
  app.use("/trip", tripRouter);
  app.use("/admin", adminRouter);

  app.use(healthRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not Found", path: req.path });
  });

  return app;
}
