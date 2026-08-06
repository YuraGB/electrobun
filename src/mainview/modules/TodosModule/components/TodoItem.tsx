import type { ReactNode } from "react";
import { useTodosActions } from "../hooks/useTodosActions";
import { EditButton } from "./EditButton";
import { EditTodo } from "./EditTodo";
import type { TTodo } from "./List";
import { RemoveTodo } from "./RemoveTodo";

export const TodoItem = ({ todo }: { todo: TTodo }): ReactNode => {
	const {
		deleteTodoMutation,
		isDeleting,
		updateTodoMutation,
		isUpdating,
		isEditing,
		setIsEditing,
	} = useTodosActions();
	let todoItem = null;

	if (isEditing) {
		todoItem = (
			<EditTodo
				todo={todo}
				isEditing={isUpdating}
				onSave={() => {
					updateTodoMutation({
						id: todo.id,
						updatedTodo: { title: todo.title },
					});
					setIsEditing(false);
				}}
			/>
		);
	}

	if (isDeleting || isUpdating) {
		todoItem = <span className="text-gray-500">Saving changes...</span>;
	}

	if (!isEditing && !isDeleting && !isUpdating) {
		todoItem = (
			<>
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={() =>
						updateTodoMutation({
							id: todo.id,
							updatedTodo: { completed: !todo.completed },
						})
					}
				/>
				<span className="flex-1 text-left items-center align-middle text-lg">
					{todo.completed && <s> {todo.title} </s>}
					{!todo.completed && <span> {todo.title} </span>}
				</span>
				<section className="flex space-x-2">
					<RemoveTodo
						todo={todo}
						onRemove={() => deleteTodoMutation(todo.id)}
					/>
					<EditButton onClick={() => setIsEditing((st) => !st)} />
				</section>
			</>
		);
	}

	return (
		<li className="flex w-full justify-between items-center space-x-2 mb-2 p-2 border rounded-md shadow-sm hover:shadow-md transition-shadow duration-300">
			{todoItem}
		</li>
	);
};
