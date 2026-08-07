import { createFileRoute } from "@tanstack/react-router";
import { Todos } from "../mainview/modules/TodosModule";

export const Route = createFileRoute("/todos")({
	component: Todos,
});
