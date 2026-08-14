import type { ReactNode } from "react";
import { LogOutButton } from "../Auth/components/LogoutButton";
import { List } from "./components/List";
import { useTodos } from "./hooks/useTodos";

export const Todos = (): ReactNode => {
	const { todos, todosError, todosLoading } = useTodos();
	return (
		<section className="flex flex-col items-center w-full justify-center min-h-screen py-2">
			<h1 className="text-3xl font-bold underline text-yellow-600">
				Todo List
			</h1>
			<div className="flex flex-col  w-full flex-1 px-20 text-center">
				{todosLoading && <p>Loading...</p>}
				{todosError && <p>Error loading todos</p>}
				{todos && <List todos={todos} />}
			</div>
			<LogOutButton />
		</section>
	);
};
