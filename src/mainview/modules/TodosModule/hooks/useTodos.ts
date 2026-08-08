import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../api";

export const useTodos = () => {
	const {
		data: todos,
		error: todosError,
		isLoading: todosLoading,
	} = useQuery({
		queryKey: ["todos"],
		queryFn: getTodos,
		gcTime: 1000 * 60 * 5,
		select: (data) =>
			data.map((todo: { id: number; title: string; completed: boolean }) => ({
				...todo,
				isEditing: false,
			})),
	});

	return {
		todos: todos,
		todosError,
		todosLoading,
	};
};
