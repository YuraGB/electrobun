import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
export const auth = betterAuth({
	baseURL: "http://localhost:3001",
	database: drizzleAdapter(db, {
		provider: "pg", // or "pg" or "mysql"
	}),
	emailAndPassword: {
		enabled: true,
	},
});
