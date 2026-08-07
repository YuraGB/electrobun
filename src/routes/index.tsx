import { createFileRoute } from "@tanstack/react-router";
import { AuthModule } from "@/mainview/modules/Auth";
import { Todos } from "../mainview/modules/TodosModule";

export const Route = createFileRoute("/")({
	// component: Todos,
	component: AuthModule,
});
