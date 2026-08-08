import type { TDBTodo } from "@/server/modules/db/types";

type Override<T, R> = Omit<T, keyof R> & R;

export type TTodoDTO = Override<
	TDBTodo,
	{
		createdAt: string;
		updatedAt: string;
	}
>;
