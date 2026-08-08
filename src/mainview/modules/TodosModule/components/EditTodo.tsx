import { useState } from "react";
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
		<div className="flex space-x-2">
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Edit todo"
				className="border p-2 flex-grow"
			/>
			<button
				type="button"
				onClick={handleSave}
				className="bg-green-500 text-white p-2"
			>
				Save changes
			</button>
		</div>
	);
};
