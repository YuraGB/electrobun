import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/mainview/modules/Auth/lib/auth-client";
import { Todos } from "../mainview/modules/TodosModule";

export const Route = createFileRoute("/todos")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data?.user.id) {
			throw redirect({ to: "/" });
		}
		return session;
	},
	component: Todos,
});
