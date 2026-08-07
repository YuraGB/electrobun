import { useCallback, useState } from "react";
import type { TAuthForm } from "../types";

export const useAuth = () => {
	const [authForm, setAuthForm] = useState<TAuthForm>("login");

	const setAuthComponent = useCallback(
		(value: TAuthForm) => setAuthForm(value),
		[],
	);

	return {
		authForm,
		setAuthComponent,
	};
};
