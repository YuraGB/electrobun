import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RemoveTodo = ({ onRemove }: { onRemove: () => void }) => {
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
			<Trash2 />
			<span hidden>Remove todo</span>
		</Button>
	);
};
