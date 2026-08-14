import {
	Field,
	FieldContent,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { TAuthForm } from "../types";

export const AuthSwitcher = ({
	value = "login",
	onChange,
}: {
	value: TAuthForm;
	onChange: (value: TAuthForm) => void;
}) => {
	return (
		<article className="bg-white  w-82.5 rounded-lg">
			<section>
				<RadioGroup
					value={value}
					onValueChange={onChange}
					className="flex flex-row grow border-transparent rounded-none"
				>
					<FieldLabel htmlFor="login" className="h-9 border-transparent">
						<Field
							orientation="horizontal"
							className="w-full border-transparent"
						>
							<FieldContent className="w-full border-transparent">
								<FieldTitle
									className={cn(
										"w-full flex justify-center transition-colors",
										value === "login" ? "text-white" : "text-muted-foreground",
									)}
								>
									Login
								</FieldTitle>
							</FieldContent>
							<RadioGroupItem value="login" id="login" hidden />
						</Field>
					</FieldLabel>
					<FieldLabel htmlFor="registration" className="h-9 w-autpfiit flex">
						<Field orientation="horizontal" className="w-auto flex">
							<FieldContent className="w-auto flex">
								<FieldTitle
									className={cn(
										"w-full flex justify-center transition-colors",
										value === "registration"
											? "text-white"
											: "text-muted-foreground",
									)}
								>
									Create account
								</FieldTitle>
							</FieldContent>
							<RadioGroupItem value="registration" id="registration" hidden />
						</Field>
					</FieldLabel>
				</RadioGroup>
			</section>
		</article>
	);
};
