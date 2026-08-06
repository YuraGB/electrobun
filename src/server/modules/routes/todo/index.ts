import { Elysia } from "elysia";
import z from "zod";
import { authPlugin } from "../authPlugin";
import {
	createTodoController,
	deleteTodoController,
	getTodosController,
	updateTodoController,
} from "./controllers";

export const todoRoutes = new Elysia({
	name: "todo-routes",
})
	.use(authPlugin)
	.get("/todos", async ({ user }) => {
		if (!user?.id) {
			throw new Error("User not authenticated");
		}
		// Fetch todos from the database for the given userId
		const todos = await getTodosController(user.id);
		return todos;
	})
	.post(
		"/todo",
		async ({ body, user }) => {
			console.log("creating todo with body:", body, "and user:", user);
			if (!user?.id) {
				throw new Error("User not authenticated");
			}
			const todo = await createTodoController({
				userId: user.id,
				title: body.title,
			});
			return todo;
		},
		{
			body: z.object({
				title: z.string().min(1, "Title is required"),
			}),
		},
	)
	.put(
		"/todo",
		async ({ body, user }) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}

			if (user.id !== body.userId) {
				throw new Error("User not authorized to update this todo");
			}
			// Update a todo
			const updatedTodo = await updateTodoController({
				id: body.id,
				title: body.title,
				completed: body.completed,
				userId: user.id,
			});
			return updatedTodo;
		},
		{
			body: z.object({
				title: z.string().min(1, "Title is required"),
				completed: z.boolean(),
				userId: z.string(),
				id: z.string(),
			}),
		},
	)
	.delete(
		"/todo",
		async ({ user, body }) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}
			// Delete a todo from the database
			const deletedTodo = await deleteTodoController(body.id);
			return deletedTodo;
		},
		{
			body: z.object({
				id: z.string().min(1, "Todo ID is required"),
			}),
		},
	);
