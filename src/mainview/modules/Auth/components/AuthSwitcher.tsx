import {
	Field,
	FieldContent,
	FieldLabel,
	FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TAuthForm } from "../types";

export const AuthSwitcher = ({
	value = "login",
	onChange,
}: {
	value: TAuthForm;
	onChange: (value: TAuthForm) => void;
}) => {
	return (
		<article>
			<section>
				<RadioGroup
					value={value}
					onValueChange={onChange}
					className="flex flex-row gap-2"
				>
					<FieldLabel htmlFor="login" className="h-9">
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle>Login in</FieldTitle>
							</FieldContent>
							<RadioGroupItem value="login" id="login" hidden />
						</Field>
					</FieldLabel>
					<FieldLabel htmlFor="registration" className="h-9 w-autpfiit flex">
						<Field orientation="horizontal" className="w-auto flex">
							<FieldContent className="w-auto flex">
								<FieldTitle className="w-auto flex size-max">
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
