import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTodo } from "../api";

export const useAddTodo = () => {
	const queryClient = useQueryClient();
	const { mutate: addTodoMutation, isPending: isAdding } = useMutation({
		mutationKey: ["todos"],
		mutationFn: addTodo,
		onSuccess: async (newTodo) => {
			console.log("New todo added:", newTodo);
			// Update the todos list with the new todo
			await queryClient.invalidateQueries({
				queryKey: ["todos"],
			});
			console.log("Todos list updated after adding new todo.");
		},
	});
	return {
		addTodoMutation,
		isAdding,
	};
};
