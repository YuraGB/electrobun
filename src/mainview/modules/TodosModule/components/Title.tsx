import type { ReactNode } from "react";

export const TodoTitle = ({ title }: { title: string }): ReactNode => {
  return <h1 className="text-3xl font-bold underline">{title}</h1>;
};
