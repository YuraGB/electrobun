import { Button } from "@/components/ui/button";
import type { TTodo } from "./List";

export const RemoveTodo = ({
	todo,
	onRemove,
}: {
	todo: TTodo;
	onRemove: () => void;
}) => {
	return (
		<Button
			variant="destructive"
			size="sm"
			type="button"
			onClick={onRemove}
			className={
				"bg-destructive text-destructive-foreground hover:bg-destructive/10 hover:cursor-pointer"
			}
		>
			Remove todo
		</Button>
	);
};
