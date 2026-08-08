import type { TDBTodo } from "@/server/modules/db/types";
import type { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";

export function dateToIso(todo: TDBTodo): TTodoDTO {
	return {
		...todo,
		createdAt: todo.createdAt.toISOString(),
		updatedAt: todo.updatedAt.toISOString(),
	};
}
