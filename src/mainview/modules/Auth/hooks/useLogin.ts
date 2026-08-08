import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "../lib/auth-client";

export const useLogin = () => {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			const { email, password } = value;
			await authClient.signIn.email(
				{
					email, // user email address
					password, // user password -> min 8 characters by default
				},
				{
					onRequest: (ctx) => {
						//show loading
					},
					onSuccess: (ctx) => {
						if (!ctx.data) return;

						if (ctx.data && typeof ctx.data === "object" && "token" in ctx.data)
							navigate({
								to: "/todos",
							});
					},
					onError: (ctx) => {
						// display the error message
						alert(ctx.error.message);
					},
				},
			);
		},
	});

	return {
		form,
	};
};
