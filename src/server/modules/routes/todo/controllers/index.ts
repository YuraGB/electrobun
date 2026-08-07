import type { TDBTodo } from "@/server/modules/db/types";
import {
	createTodoInDatabase,
	deleteTodoFromDatabase,
	fetchTodosFromDatabase,
	updateTodoInDatabase,
} from "../services";

export const getTodosController = async (
	userId: string,
): Promise<TDBTodo[]> => {
	if (!userId || typeof userId !== "string") {
		throw new Error("User ID not found in cookies");
	}
	// Fetch todos from the database for the given userId
	const todos = await fetchTodosFromDatabase(userId);
	return todos ?? [];
};

export const createTodoController = async (todoData: {
	userId: string;
	title: string;
}) => {
	// Create a new todo in the database
	const newTodo = await createTodoInDatabase(todoData);
	return newTodo;
};

export const updateTodoController = async (todoData: {
	id: string;
	title: string;
	completed?: boolean;
	userId: string;
}) => {
	// Update a todo in the database
	const updatedTodo = await updateTodoInDatabase(todoData);
	return updatedTodo;
};

export const deleteTodoController = async (id: string) => {
	// Delete a todo from the database
	const deletedTodo = await deleteTodoFromDatabase(id);
	return deletedTodo;
};
