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
	.get(
		"/todos",
		async ({ user }) => {
			if (!user?.id) {
				throw new Error("User not authenticated");
			}
			// Fetch todos from the database for the given userId
			return await getTodosController(user.id);
		},
		{
			response: z.array(
				z.object({
					id: z.number(),
					title: z.string(),
					description: z.string().nullable(),
					completed: z.boolean().nullable(),
					createdAt: z.date(),
					updatedAt: z.date(),
					userId: z.number(),
				}),
			),
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
			response: z.object({
				id: z.number(),
				title: z.string(),
				description: z.string().nullable(),
				completed: z.boolean().nullable(),
				createdAt: z.date(),
				updatedAt: z.date(),
				userId: z.number(),
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
			return await updateTodoController({
				id: body.id,
				title: body.title,
				completed: body.completed,
				userId: user.id,
			});
		},
		{
			body: z.object({
				title: z.string().min(1, "Title is required"),
				completed: z.boolean(),
				userId: z.string(),
				id: z.string(),
			}),
			response: z.object({
				id: z.number(),
				title: z.string(),
				description: z.string().nullable(),
				completed: z.boolean().nullable(),
				createdAt: z.date(),
				updatedAt: z.date(),
				userId: z.number(),
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
			// body.id is a string per the route schema, pass it through as-is
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
