import type { ReactNode } from "react";
import { LogOutButton } from "../Auth/components/LogoutButton";
import { List } from "./components/List";
import { TodoList as TodoListComponent } from "./components/TodoList";
import { TodoListTitle } from "./components/TodoListTitle";
import { TodoListWrapper } from "./components/TodoListWrapper";
import { TodosLoading } from "./components/TodosLoading";
import { TodosLoadingError } from "./components/TodosLoadingError";
import { useTodos } from "./hooks/useTodos";

export const Todos = (): ReactNode => {
	const { todos, todosError, todosLoading } = useTodos();
	return (
		<TodoListComponent>
			<TodoListTitle />
			<TodoListWrapper>
				<TodosLoading isLoading={todosLoading} />
				<TodosLoadingError error={todosError?.message ?? ""} />
				{todos && <List todos={todos} />}
			</TodoListWrapper>
			<LogOutButton />
		</TodoListComponent>
	);
};
