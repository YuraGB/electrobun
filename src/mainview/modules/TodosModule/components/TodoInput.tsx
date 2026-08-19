import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const TodoInput = ({
	onAction,
	buttonLabel = "New todo",
	onChange,
	searchValue,
	reset,
}: {
	onAction: (value: string) => void;
	buttonLabel: string;
	searchValue: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	reset: () => void;
}) => {
	const handleAdd = () => {
		if (searchValue.trim() !== "") {
			onAction(searchValue);
			reset();
		}
	};

	return (
		<div className="flex space-x-2">
			<Input
				type="text"
				size={40}
				value={searchValue}
				onChange={onChange}
				placeholder="Add a new todo"
				className="border p-2 grow h-10 text-yellow-500 text-lg bg-green-custom"
				onKeyDown={(e) => (e.key === "Enter" ? handleAdd() : null)}
			/>
			<Button
				type="button"
				onClick={handleAdd}
				className="bg-blue-500 text-white p-2 min-h-10 flex text-nowrap"
			>
				{buttonLabel}
			</Button>
		</div>
	);
};
