import { Elysia } from "elysia";
import { cookie } from "./cookie";
import { healthRoutes } from "./health";
import { securityHeaders } from "./security/headers";
import { todoRoutes } from "./todo";

export const routes = new Elysia({
	name: "routes",
	cookie,
})
	.use(todoRoutes)
	.use(securityHeaders)
	.use(healthRoutes);
