import { eq } from "drizzle-orm";
import { tryCatch } from "../../../../../utils/asyncHelpers";
import { logger } from "../../../../../utils/frontend_logger";
import { db } from "../../../db";
import { todoTable } from "../../../db/schemas/todoSchema";

export const fetchTodosFromDatabase = async (userId: string) => {
	const { data, error } = await tryCatch(
		async () =>
			await db
				.select()
				.from(todoTable)
				.where(eq(todoTable.userId, Number(userId))),
	);

	if (error) {
		logger.error("Error fetching todos from database:", error);
		throw new Error("Failed to fetch todos from database");
	}

	return data;
};

export const createTodoInDatabase = async (todoData: {
	userId: string;
	title: string;
}) => {
	const { data, error } = await tryCatch(
		async () =>
			await db
				.insert(todoTable)
				.values({
					userId: Number(todoData.userId),
					title: todoData.title,
				})
				.returning(),
	);

	if (error) {
		logger.error("Error creating todo in database:", error);
		throw new Error("Failed to create todo in database");
	}

	if (!data || data.length === 0) {
		throw new Error("Failed to create todo in database: No data returned");
	}

	return data[0]; // Return the newly created todo
};

export const updateTodoInDatabase = async (todoData: {
	id: string;
	title?: string;
	completed?: boolean;
	userId: string;
}) => {
	const { data, error } = await tryCatch(
		async () =>
			await db
				.update(todoTable)
				.set({
					title: todoData.title,
					completed: todoData.completed,
					updatedAt: new Date(), // Update the updatedAt timestamp
				})
				.where(eq(todoTable.id, Number(todoData.id)))
				.returning(),
	);

	if (error) {
		logger.error("Error updating todo in database:", error);
		throw new Error("Failed to update todo in database");
	}

	if (!data || data.length === 0) {
		throw new Error("Failed to update todo in database: No data returned");
	}

	return data[0]; // Return the updated todo
};

export const deleteTodoFromDatabase = async (id: string) => {
	const { data, error } = await tryCatch(
		async () => await db.delete(todoTable).where(eq(todoTable.id, Number(id))),
	);

	if (error) {
		logger.error("Error deleting todo from database:", error);
		throw new Error("Failed to delete todo from database");
	}

	if (!data || (typeof data === "object" && data.rowCount === 0)) {
		throw new Error("Failed to delete todo from database: No rows affected");
	}

	return { message: "Todo deleted successfully" };
};

export const getTodoByIdFromDatabase = async (id: string) => {
	const { data, error } = await tryCatch(
		async () =>
			await db
				.select()
				.from(todoTable)
				.where(eq(todoTable.id, Number(id))),
	);

	if (error) {
		logger.error("Error fetching todo by ID from database:", error);
		throw new Error("Failed to fetch todo by ID from database");
	}

	if (!data || data.length === 0) {
		throw new Error("Todo not found in database");
	}

	return data[0]; // Return the fetched todo
};
