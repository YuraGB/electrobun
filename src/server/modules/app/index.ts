import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { ELYSIA_PORT } from "../../../constants";
import { ELECTROBUN_APP_URL } from "../../../constants/shared";
import { auth } from "../auth";
import { runMigrations } from "../db/migrations";
import { routes } from "../routes";
import { authPlugin } from "../routes/authPlugin";

await runMigrations();

new Elysia({
	aot: true,
	name: "Electobun",
})
	.use(
		cors({
			origin: ELECTROBUN_APP_URL,
			credentials: true,
		}),
	)
	.all("/api/auth/*", async ({ request }) => await auth.handler(request))
	.use(authPlugin)
	.use(routes)
	.listen(ELYSIA_PORT, () =>
		console.log(`Server running on http://localhost:${ELYSIA_PORT}`),
	);
