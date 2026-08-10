import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemTitle,
} from "@/components/ui/item";
import type { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";

export const EditTodo = ({
	todo,
	onSave,
	isEditing,
}: {
	todo: TTodoDTO;
	isEditing: boolean;
	onSave: (updatedTodo: TTodoDTO) => void;
}) => {
	const [title, setTitle] = useState(todo.title);

	const handleSave = () => {
		if (title.trim() !== "") {
			onSave({ ...todo, title });
		}
	};

	if (isEditing) {
		return <span className="text-gray-500">Saving changes...</span>;
	}

	return (
		<Item
			variant="outline"
			className="w-full bg-green-custom min-h-23.5 border-green-custom hover:bg-green-custom-light hover:scale-105"
		>
			<ItemContent title="todo title">
				<FieldGroup className="mx-auto w-56">
					<Field orientation="horizontal">
						<ItemTitle className="text-left pl-2">
							<Input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Edit todo"
								className="border p-2 grow"
								onKeyDown={(e) => (e.key === "Enter" ? handleSave() : null)}
							/>
						</ItemTitle>
					</Field>
				</FieldGroup>
			</ItemContent>
			<ItemActions title="todo actions" className="flex flex-col p-2">
				<Button
					type="button"
					onClick={handleSave}
					className="bg-green-500 text-white p-2"
				>
					Save changes
				</Button>
			</ItemActions>
		</Item>
	);
};
