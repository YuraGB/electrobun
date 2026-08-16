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
		todoItem = (
			<Item
				variant="outline"
				className="w-full bg-green-custom border-green-custom min-h-23.5 hover:bg-green-custom-light hover:scale-105 "
			>
				<ItemContent title="todo title">
					<FieldGroup className="mx-auto w-56">
						<Field orientation="horizontal">
							<ItemTitle className="text-left pl-2">
								<span className={"text-lg text-yellow-600"}>
									Saving changes...
								</span>
							</ItemTitle>
						</Field>
					</FieldGroup>
				</ItemContent>
				<ItemActions
					title="todo actions"
					className="flex flex-col p-2 py-4"
				></ItemActions>
			</Item>
		);
	}

	if (!isEditing && !isDeleting && !isUpdating) {
		todoItem = (
			<Item
				variant="outline"
				className="w-full bg-green-custom border-green-custom hover:bg-green-custom-light hover:scale-105"
			>
				<ItemContent title="todo title">
					<FieldGroup className="mx-auto w-[90%]">
						<Field orientation="horizontal">
							<Checkbox
								id={String(todo.id)}
								name={todo.title}
								className={
									"size-6 text-yellow-600 max-w-6 min-w-6 max-h-6 min-h-6"
								}
								checked={todo.completed ?? false}
								onCheckedChange={(checked) => {
									updateTodoMutation({
										...todo,
										completed: checked,
									});
								}}
							/>
							<ItemTitle className="text-left pl-2">
								<span className={"text-[1rem] text-yellow-500"}>
									{todo.completed && <s> {todo.title} </s>}
									{!todo.completed && <span> {todo.title} </span>}
								</span>
							</ItemTitle>
						</Field>
					</FieldGroup>
				</ItemContent>
				<ItemActions title="todo actions" className="flex flex-col p-2 px-8">
					<RemoveTodo onRemove={() => deleteTodoMutation(String(todo.id))} />
					<EditButton onClick={() => setIsEditing((st) => !st)} />
				</ItemActions>
			</Item>
		);
	}

	return (
		<li className="flex justify-center my-1">
			<div className="flex w-full max-w-md flex-col gap-2">{todoItem}</div>
		</li>
	);
};
