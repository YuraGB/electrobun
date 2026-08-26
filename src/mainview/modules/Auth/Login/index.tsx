import { Button } from "@/components/ui/button";
import { FieldInfo } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
	const { form } = useLogin();
	return (
		<article className="py-10 px-12 bg-green-custom rounded-2xl  w-82.5">
			<h2 className="text-yellow-500 text-2xl mb-4">Welcome back</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<div className="pb-5">
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
									<Label className="text-white pb-2" htmlFor={field.name}>
										First Name:
									</Label>
									<Input
										className="text-white text-2xl"
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
				<div className="pb-5">
					<form.Field
						name="password"
						children={(field) => (
							<>
								<Label className="text-white pb-2" htmlFor={field.name}>
									Password:
								</Label>
								<Input
									className="text-white text-2xl"
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
							<Button
								type="submit"
								disabled={!canSubmit}
								variant={"secondary"}
								className={"w-full mb-2 hover:cursor-pointer"}
							>
								{isSubmitting ? "..." : "Submit"}
							</Button>
							<Button
								className={"w-full hover:cursor-pointer"}
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
