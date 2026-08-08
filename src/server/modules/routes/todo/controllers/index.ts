import { dateToIso } from "../../../../../utils/dateToString";
import {
	createTodoInDatabase,
	deleteTodoFromDatabase,
	fetchTodosFromDatabase,
	updateTodoInDatabase,
} from "../services";
import type { TTodoDTO } from "./types";

export const getTodosController = async (
	userId: string,
): Promise<TTodoDTO[]> => {
	if (!userId || typeof userId !== "string") {
		throw new Error("User ID not found in cookies");
	}
	// Fetch todos from the database for the given userId
	const todos = await fetchTodosFromDatabase(userId);
	return (todos ?? []).map(dateToIso);
};

export const createTodoController = async (todoData: {
	userId: string;
	title: string;
}) => {
	// Create a new todo in the database
	const newTodo = await createTodoInDatabase(todoData);
	return dateToIso(newTodo);
};

export const updateTodoController = async (todoData: TTodoDTO) => {
	// Update a todo in the database
	const updatedTodo = await updateTodoInDatabase(todoData);
	return dateToIso(updatedTodo);
};

export const deleteTodoController = async (id: string) => {
	// Delete a todo from the database
	const deletedTodo = await deleteTodoFromDatabase(id);
	return deletedTodo;
};
