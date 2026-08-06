import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteTodo, updateTodo } from "../api";
import type { TTodo } from "../components/List";

export const useTodosActions = () => {
	const [isEditing, setIsEditing] = useState(false);
	const queryClient = useQueryClient();
	const { mutate: deleteTodoMutation, isPending: isDeleting } = useMutation({
		mutationKey: ["todos"],
		mutationFn: deleteTodo,
		onSuccess: (_, todoId) => {
			// Update the todos list by removing the deleted todo
			queryClient.setQueryData(["todos"], (oldTodos: TTodo[]) =>
				oldTodos.filter((todo) => todo.id !== todoId),
			);
		},
	});
	const { mutate: updateTodoMutation, isPending: isUpdating } = useMutation<
		any,
		unknown,
		{ id: number; updatedTodo: Partial<{ title: string; completed: boolean }> }
	>({
		mutationKey: ["todos"],
		// Accept a single variables object and forward to the API helper
		mutationFn: ({ id, updatedTodo }) => updateTodo(id, updatedTodo),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["todos"],
			});
		},
	});

	return {
		deleteTodoMutation,
		isDeleting,
		updateTodoMutation,
		isUpdating,
		isEditing,
		setIsEditing,
	};
};
