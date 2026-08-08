import type { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";
import { useAddTodo } from "../hooks/useAddTodo";
import { AddTodoInput } from "./AddTodoInput";
import { TodoItem } from "./TodoItem";

export const List = ({ todos }: { todos: TTodoDTO[] }) => {
	const { addTodoMutation, isAdding } = useAddTodo();
	return (
		<>
			<section className="flex flex-col items-center justify-center w-full px-20 w-full text-center mb-4 mt-10">
				{isAdding ? (
					<li className="text-gray-500 gap-2 py-2">Adding new todo...</li>
				) : (
					<AddTodoInput onAdd={(title) => addTodoMutation(title)} />
				)}
			</section>
			<ul className="flex flex-col w-full flex-1 px-2 ">
				{todos.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</ul>
		</>
	);
};
