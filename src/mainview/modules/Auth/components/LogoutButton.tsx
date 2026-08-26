import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogOut } from "../hooks/useLogOut";

export const LogOutButton = () => {
	const { onLogOutHandler } = useLogOut();
	return (
		<Button
			size="icon-lg"
			className="fixed bottom-6 right-6 rounded-full shadow-lg p-5 bg-green-custom text-amber-50"
			onClick={onLogOutHandler}
		>
			<LogOut className="size-5" />
		</Button>
	);
};
