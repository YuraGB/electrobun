import { AuthSwitcher } from "./components/AuthSwitcher";

export const AuthModule = () => {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<AuthSwitcher value="login" onChange={() => {}} />
		</div>
	);
};
