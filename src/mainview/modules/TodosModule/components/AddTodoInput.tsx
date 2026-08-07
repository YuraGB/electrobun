import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const AddTodoInput = ({ onAdd }: { onAdd: (title: string) => void }) => {
	const [title, setTitle] = useState("");

	const handleAdd = () => {
		if (title.trim() !== "") {
			onAdd(title);
			setTitle("");
		}
	};

	return (
		<div className="flex space-x-2">
			<Input
				type="text"
				size={40}
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Add a new todo"
				className="border p-2 flex-grow h-10"
			/>
			<Button
				size={"lg"}
				type="button"
				onClick={handleAdd}
				className="bg-blue-500 text-white p-2"
			>
				Add new todo
			</Button>
		</div>
	);
};
