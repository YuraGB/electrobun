import { AuthSwitcher } from "./components/AuthSwitcher";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./Login";
import { RegistrationForm } from "./Registration";

export const AuthModule = () => {
	const { authForm, setAuthComponent } = useAuth();

	const form = authForm === "login" ? <LoginForm /> : <RegistrationForm />;
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<AuthSwitcher value={authForm} onChange={setAuthComponent} />
			{form}
		</div>
	);
};
