import type { ReactNode } from "react";

export const TodoListWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className="flex flex-col  w-full flex-1 px-20 text-center">
			{children}
		</div>
	);
};
