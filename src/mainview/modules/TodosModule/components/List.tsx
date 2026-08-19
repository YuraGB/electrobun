import type { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";
import { useAddTodo } from "../hooks/useAddTodo";
import { useSearchTodo } from "../hooks/useSearchTodo";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";

export const List = ({ todos }: { todos: TTodoDTO[] }) => {
	const { addTodoMutation, isAdding } = useAddTodo();
	const { filteredItems, handleChange, resetQuery, query } =
		useSearchTodo(todos);
	return (
		<>
			<section className="flex flex-col items-center justify-center  px-20 w-full text-center mb-4 mt-10">
				{isAdding ? (
					<li className="text-gray-500 gap-2 py-2">Adding new todo...</li>
				) : (
					<TodoInput
						onAction={(title) => addTodoMutation(title)}
						buttonLabel="New todo"
						onChange={handleChange}
						searchValue={query}
						reset={resetQuery}
					/>
				)}
			</section>
			<ul className="flex flex-col w-full flex-1 px-2 ">
				{filteredItems.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</ul>
		</>
	);
};
