import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { DB_URL } from "./src/constants";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/server/modules/db/schemas/*.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: DB_URL,
	},
});
