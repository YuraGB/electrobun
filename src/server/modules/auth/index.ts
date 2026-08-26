import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
	BETER_AUTH_BASE_URL,
	ELECTROBUN_APP_URL,
	ELECTROBUN_SERV_URL,
	ELECTROBUN_VIEW_ORIGIN,
} from "../../../constants/shared";
import { db } from "../db";
import {
	account,
	session,
	user,
	verification,
} from "../db/schemas/auth-schema";
export const auth = betterAuth({
	baseURL: BETER_AUTH_BASE_URL,
	trustedOrigins: [
		ELECTROBUN_APP_URL,
		ELECTROBUN_SERV_URL,
		ELECTROBUN_VIEW_ORIGIN,
	],
	database: drizzleAdapter(db, {
		provider: "pg", // or "pg" or "mysql"
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30 днів
		updateAge: 60 * 60 * 24, // оновлювати раз на день
	},
	emailAndPassword: {
		enabled: true,
	},
});
