import { Elysia } from "elysia";
import z from "zod";
import { authPlugin } from "../authPlugin";
import {
	createTodoController,
	deleteTodoController,
	getTodosController,
	updateTodoController,
} from "./controllers";
import { todoSchema } from "./validation";

export const todoRoutes = new Elysia({
	name: "todo-routes",
	aot: true,
})
	.use(authPlugin)
	.get(
		"/todos",
		async ({ user }) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}
			const todos = await getTodosController(user.id);
			return todos;
		},
		{
			response: z.array(todoSchema),
		},
	)
	.post(
		"/todo",
		async ({ body, user }) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}
			return await createTodoController({
				userId: user.id,
				title: body.title,
			});
		},
		{
			body: z.object({
				title: z.string().min(1, "Title is required"),
			}),
			response: todoSchema,
		},
	)
	.put(
		"/todo",
		async ({ body, user }) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}

			if (Number(user.id) !== Number(body.userId)) {
				throw new Error("User not authorized to update this todo");
			}
			return await updateTodoController(body);
		},
		{
			body: todoSchema,
			response: todoSchema,
		},
	)
	.delete(
		"/todo",
		async ({ user, body }) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}

			return await deleteTodoController(body.id);
		},
		{
			body: z.object({
				id: z.string().min(1, "Todo ID is required"),
			}),
			response: z.object({
				message: z.string(),
			}),
		},
	);
