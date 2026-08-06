import { Elysia } from "elysia";
import { auth } from "../../auth";

export const authPlugin = new Elysia({ name: "auth-plugin" })
	.resolve(async ({ request }) => {
		console.log("Resolving auth for request:", request);
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		return {
			session,
			user: session?.user ?? null,
		};
	})
	.as("global");
