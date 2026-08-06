import { Button } from "@/components/ui/button";

export const EditButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<Button
			variant="secondary"
			size="sm"
			type="button"
			onClick={onClick}
			className={
				"bg-warning text-destructive-foreground hover:bg-warning/40 hover:cursor-pointer"
			}
		>
			Edit todo
		</Button>
	);
};
