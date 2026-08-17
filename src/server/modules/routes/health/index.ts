import Elysia from "elysia";
import z from "zod";

export const healthRoutes = new Elysia({
	name: "health",
})
	.get("/ping", ({ status }) => status(200, "pong"), {
		response: z.literal("pong"),
	})
	.get("/health", ({ status }) => status(200, "ok"), {
		response: z.literal("ok"),
	})
	.get("/ready", async ({ status }) => status(200, "ok"), {
		response: z.literal("ok"),
	});
