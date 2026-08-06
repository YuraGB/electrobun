import { Elysia } from "elysia";
import { runMigrations } from "../db/migrations";
import { routes } from "../routes";
import { authPlugin } from "../routes/authPlugin";

await runMigrations();

new Elysia({
	aot: true,
	name: "Electobun",
})
	.use(authPlugin)
	.get("/", ({ user }) => user)
	.use(routes)
	.listen(3001, () => console.log("Server running on http://localhost:3001"));
