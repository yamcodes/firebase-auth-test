import type { PropsWithChildren } from "react";
import { FatAuth } from "~/core";

export const LoginButton = ({ children }: PropsWithChildren) => {
	const auth = new FatAuth();

	const handleLogin = () => {
		auth.login();
	};

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" || event.key === " ") {
			handleLogin();
		}
	};

	return (
		<button type="button" onClick={handleLogin} onKeyPress={handleKeyPress}>
			{children}
		</button>
	);
};
