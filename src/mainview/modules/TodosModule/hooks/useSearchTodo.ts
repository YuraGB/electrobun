import type { ChangeEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import type { TTodoDTO } from "@/server/modules/routes/todo/controllers/types";

export const useSearchTodo = (items: TTodoDTO[]) => {
	const [query, setQuery] = useState("");
	const [isPending, startTransition] = useTransition();
	const [search, setSearch] = useState("");

	const filteredItems = useMemo(() => {
		return items.filter(({ title }) =>
			title.toLowerCase().includes(search.toLowerCase()),
		);
	}, [items, search]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		setQuery(value);

		startTransition(() => {
			setSearch(value);
		});
	};

	const resetQuery = () => {
		setQuery("");
		setSearch("");
	};

	return {
		query,
		isPending,
		filteredItems,
		handleChange,
		resetQuery,
	};
};
