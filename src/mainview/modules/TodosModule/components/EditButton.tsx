import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EditButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button
			variant="secondary"
			size="sm"
			type="button"
			onClick={onClick}
			className={
				"bg-teal-400 text-destructive-foreground hover:bg-warning/40 hover:cursor-pointer"
			}
		>
			<span hidden>Edit todo</span>
			<Edit2 size={"20"} />
		</Button>
	);
};
