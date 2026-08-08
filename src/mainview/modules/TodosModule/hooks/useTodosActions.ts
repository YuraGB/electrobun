import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";
import { deleteTodo, updateTodo } from "../api";

export const useTodosActions = () => {
	const [isEditing, setIsEditing] = useState(false);
	const queryClient = useQueryClient();
	const { mutate: deleteTodoMutation, isPending: isDeleting } = useMutation({
		mutationKey: ["todos"],
		mutationFn: deleteTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["todos"],
			});
		},
	});
	const { mutate: updateTodoMutation, isPending: isUpdating } = useMutation({
		mutationKey: ["todos"],
		// Accept a single variables object and forward to the API helper
		mutationFn: (updatedTodo: TTodoDTO) => updateTodo(updatedTodo),
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
