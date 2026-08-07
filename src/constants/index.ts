import { dirname, join } from "node:path";
import { fileURLToPath } from "bun";
import { config } from "dotenv";

const appDirectory = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(appDirectory, ".env");

config({
	path: envPath,
});

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error(`DATABASE_URL is missing. Expected it in ${envPath}.`);
}

export const DB_URL = databaseUrl;
export const IS_DEV = process.env.NODE_ENV === "development";
export const MIGRATIONS_DIR = join(appDirectory, "drizzle");
export const ELYSIA_PORT = process.env.ELYSIA_PORT || 3001;
