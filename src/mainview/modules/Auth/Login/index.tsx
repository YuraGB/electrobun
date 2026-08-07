import { Button } from "@/components/ui/button";
import { FieldInfo } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
	const { form } = useLogin();
	return (
		<article>
			<h2>Welcome back</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div>
					{/* A type-safe field component*/}
					<form.Field
						name="email"
						validators={{
							onChange: ({ value }) =>
								!value
									? "A first name is required"
									: value.length < 3
										? "First name must be at least 3 characters"
										: undefined,
							onChangeAsyncDebounceMs: 500,
							onChangeAsync: async ({ value }) => {
								await new Promise((resolve) => setTimeout(resolve, 1000));
								return (
									value.includes("error") && 'No "error" allowed in first name'
								);
							},
						}}
						children={(field) => {
							// Avoid hasty abstractions. Render props are great!
							return (
								<>
									<Label htmlFor={field.name}>First Name:</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
									<FieldInfo field={field} />
								</>
							);
						}}
					/>
				</div>
				<div>
					<form.Field
						name="password"
						children={(field) => (
							<>
								<Label htmlFor={field.name}>Password:</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<FieldInfo field={field} />
							</>
						)}
					/>
				</div>
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<>
							<Button type="submit" disabled={!canSubmit}>
								{isSubmitting ? "..." : "Submit"}
							</Button>
							<Button
								type="reset"
								onClick={(e) => {
									// Avoid unexpected resets of form elements (especially <select> elements)
									e.preventDefault();
									form.reset();
								}}
							>
								Reset
							</Button>
						</>
					)}
				/>
			</form>
		</article>
	);
};
