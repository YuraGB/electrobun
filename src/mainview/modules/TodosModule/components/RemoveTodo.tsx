import { TTodo } from "./List";

export const RemoveTodo = ({
	todo,
	onRemove,
}: {
	todo: TTodo;
	onRemove: () => void;
}) => {
	return (
		<button
			type="button"
			onClick={onRemove}
			className="bg-red-500 text-white p-2"
		>
			Remove todo
		</button>
	);
};
