import { useAddTodo } from "../hooks/useAddTodo";
import { AddTodoInput } from "./AddTodoInput";
import { TodoItem } from "./TodoItem";

export type TTodo = {
	id: number;
	title: string;
	completed: boolean;
	isEditing: boolean;
};

export const List = ({ todos }: { todos: TTodo[] }) => {
	const { addTodoMutation, isAdding } = useAddTodo();
	return (
		<>
			<section className="flex flex-col items-center justify-center w-full flex-1 px-20 w-full text-center mb-4">
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
