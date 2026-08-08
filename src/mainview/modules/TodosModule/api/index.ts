import { BETER_AUTH_BASE_URL } from "@/constants/shared";
import type { TDBTodo } from "@/server/modules/db/types";
import { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";
import { logger } from "@/utils/frontend_logger";

export const getTodos = async () => {
	const response = await fetch(`${BETER_AUTH_BASE_URL}/todos`, {
		method: "GET",
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error("Failed to fetch todos");
	}
	return response.json();
};

export const addTodo = async (title: string) => {
	const response = await fetch(`${BETER_AUTH_BASE_URL}/todo`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ title, completed: false }),
	});
	if (!response.ok) {
		throw new Error("Failed to add todo");
	}
	return response.json();
};

export const updateTodo = async (updatedTodo: TTodoDTO) => {
	const response = await fetch(`${BETER_AUTH_BASE_URL}/todo`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(updatedTodo),
	});
	if (!response.ok) {
		throw new Error("Failed to update todo");
	}
	return response.json();
};

export const deleteTodo = async (id: string) => {
	const response = await fetch(`${BETER_AUTH_BASE_URL}/todo`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({
			id,
		}),
	});
	if (!response.ok) {
		throw new Error("Failed to delete todo");
	}
	return response.json();
};
