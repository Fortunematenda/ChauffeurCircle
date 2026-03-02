import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./db/prisma";

const app = createApp();

const server = app.listen(env.PORT, () => {
  process.stdout.write(`ChauffeurCircle API listening on http://localhost:${env.PORT}\n`);
});

async function shutdown(signal: string) {
  process.stdout.write(`Received ${signal}. Shutting down...\n`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
