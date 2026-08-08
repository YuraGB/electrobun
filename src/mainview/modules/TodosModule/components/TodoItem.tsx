import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemTitle,
} from "@/components/ui/item";
import type { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";
import { useTodosActions } from "../hooks/useTodosActions";
import { EditButton } from "./EditButton";
import { EditTodo } from "./EditTodo";
import { RemoveTodo } from "./RemoveTodo";

export const TodoItem = ({ todo }: { todo: TTodoDTO }): ReactNode => {
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
				onSave={(t) => {
					updateTodoMutation(t);
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
			<Item variant="outline" className="w-full">
				<ItemContent title="todo title">
					<FieldGroup className="mx-auto w-56">
						<Field orientation="horizontal">
							<Checkbox
								id={String(todo.id)}
								name={todo.title}
								className={"size-6 max-w-6 min-w-6 max-h-6 min-h-6"}
								checked={todo.completed ?? false}
								onCheckedChange={(checked) => {
									updateTodoMutation({
										...todo,
										completed: checked,
									});
								}}
							/>
							<ItemTitle className="text-left pl-2">
								<span className={"text-lg"}>
									{todo.completed && <s> {todo.title} </s>}
									{!todo.completed && <span> {todo.title} </span>}
								</span>
							</ItemTitle>
						</Field>
					</FieldGroup>
				</ItemContent>
				<ItemActions title="todo actions" className="flex flex-col p-2">
					<RemoveTodo onRemove={() => deleteTodoMutation(String(todo.id))} />
					<EditButton onClick={() => setIsEditing((st) => !st)} />
				</ItemActions>
			</Item>
		);
	}

	return (
		<li className="flex justify-center">
			<div className="flex w-full max-w-md flex-col gap-2">{todoItem}</div>
		</li>
	);
};
