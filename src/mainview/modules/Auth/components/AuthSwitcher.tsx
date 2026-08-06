import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const AuthSwitcher = ({
	value,
	onChange,
}: {
	value: "login" | "register";
	onChange: (value: "login" | "register") => void;
}) => {
	return (
		<article>
			<section>
				<RadioGroup
					defaultValue={value}
					onValueChange={(val) => onChange(val as "login" | "register")}
					className="flex flex-row gap-4"
				>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="login" id="login" />
						<Label htmlFor="login">Login</Label>
					</div>
					<div className="flex items-center gap-2">
						<RadioGroupItem value="register" id="register" />
						<Label htmlFor="register">Register</Label>
					</div>
				</RadioGroup>
			</section>
		</article>
	);
};
