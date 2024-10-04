import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { getQueryParams } from "utilities";
import { env } from "./config";
import "./App.css";

export const AppContent = () => {
	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			const { redirect } = getQueryParams();
			if (!redirect) throw new Error("No redirect");
			const targetUrl = new URL(redirect);
			targetUrl.searchParams.set("access_token", tokenResponse.access_token);
			window.location.href = targetUrl.href;
		},
	});
	return (
		<>
			<code>fat-login</code>
			<br />
			<p>Hello to you!</p>
			<button
				type="button"
				onClick={() => {
					login();
				}}
			>
				Sign-in with Google
			</button>
		</>
	);
};

export const App = () => {
	return (
		<GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
			<AppContent />
		</GoogleOAuthProvider>
	);
};
