import { useNavigate } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";

export const useLogOut = () => {
	const navigate = useNavigate();
	const onLogOutHandler = async (): Promise<void> => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({
						to: "/",
					}); // redirect to login page
				},
			},
		});
	};
	return {
		onLogOutHandler,
	};
};
