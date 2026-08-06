export const getTodos = async () => {
	console.log("Fetching todos...");
	const response = await fetch("https://jsonplaceholder.typicode.com/todos");
	if (!response.ok) {
		throw new Error("Failed to fetch todos");
	}
	return response.json();
};

export const addTodo = async (title: string) => {
	const response = await fetch("http://localhost:3001/todo", {
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

export const updateTodo = async (
	id: number,
	updatedTodo: Partial<{ title: string; completed: boolean }>,
) => {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/todos/${id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedTodo),
		},
	);
	if (!response.ok) {
		throw new Error("Failed to update todo");
	}
	return response.json();
};

export const deleteTodo = async (id: number) => {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/todos/${id}`,
		{
			method: "DELETE",
		},
	);
	if (!response.ok) {
		throw new Error("Failed to delete todo");
	}
	return response.json();
};
