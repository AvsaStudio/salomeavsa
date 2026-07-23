import "dotenv/config";
import { app } from "./app.js";
import { closeDatabase, isDatabaseConfigured } from "./db/pool.js";

const port = Number(process.env.PORT) || 3001;
const server = app.listen(port, () => {
  console.log(
    `BrewBot API listening on http://localhost:${port} (database: ${
      isDatabaseConfigured ? "configured" : "not configured"
    })`
  );
});

async function shutdown(signal: string) {
  console.log(`${signal} received; shutting down.`);
  server.close(async () => {
    await closeDatabase();
    process.exit(0);
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
