import type { ReactNode } from "react";

export const TodoList = ({ children }: { children: ReactNode }) => {
	return (
		<section className="flex flex-col items-center w-full justify-center min-h-screen py-2">
			{children}
		</section>
	);
};
