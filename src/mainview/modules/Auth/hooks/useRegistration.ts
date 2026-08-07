import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { safeJsonParse } from "@/utils/asyncHelpers";
import { logger } from "@/utils/frontend_logger";
import { authClient } from "../lib/auth-client";

export const useRegistration = () => {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			const { email, password, name } = value;
			const { data } = await authClient.signUp.email(
				{
					email, // user email address
					password, // user password -> min 8 characters by default
					name, // user display name
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

			logger.info(JSON.stringify(data));
		},
	});
	return {
		form,
	};
};
