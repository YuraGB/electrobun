import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthModule } from "@/mainview/modules/Auth";
import { authClient } from "@/mainview/modules/Auth/lib/auth-client";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (session.data?.user.id) {
			throw redirect({ to: "/todos" });
		}
	},
	component: AuthModule,
});
