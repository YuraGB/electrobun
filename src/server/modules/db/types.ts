import type { InferSelectModel } from "drizzle-orm";
import type { todoTable } from "./schemas/todoSchema";

export type TDBTodo = InferSelectModel<typeof todoTable>;
