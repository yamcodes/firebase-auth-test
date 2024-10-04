import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { getQueryParams } from "@repo/utilities";
import { Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button, Switch } from "~/components";
import { env } from "./config";

export const AppContent = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { theme, setTheme } = useTheme();

	const login = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			const { redirect } = getQueryParams();
			if (!redirect) throw new Error("No redirect");
			const targetUrl = new URL(redirect);
			targetUrl.searchParams.set("access_token", tokenResponse.access_token);
			window.location.href = targetUrl.href;
		},
	});

	const handleLogin = () => {
		setIsLoading(true);
		login();
	};

	return (
		<div
			className={`flex flex-col items-center justify-center min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-background text-foreground"}`}
		>
			<div className="absolute top-4 right-4 flex items-center space-x-2">
				<Switch
					checked={theme === "dark"}
					onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
				/>
				{theme === "dark" ? (
					<Moon className="h-4 w-4" />
				) : (
					<Sun className="h-4 w-4" />
				)}
			</div>
			<div className="text-center space-y-6">
				<h1 className="text-4xl font-bold">
					Welcome to <code>fat-login</code>
				</h1>
				<p className="text-xl text-muted-foreground">Sign in to continue</p>
				<Button
					size="lg"
					className="w-64 h-14 text-lg"
					onClick={handleLogin}
					disabled={isLoading}
					variant={theme === "dark" ? "secondary" : "default"}
				>
					{isLoading ? (
						<Loader2 className="mr-2 h-5 w-5 animate-spin" />
					) : (
						<svg
							className="mr-2 h-5 w-5"
							viewBox="0 0 24 24"
							aria-labelledby="googleIconTitle"
						>
							<title id="googleIconTitle">Google icon</title>
							<path
								fill="currentColor"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="currentColor"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="currentColor"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="currentColor"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
					)}
					Sign in with Google
				</Button>
			</div>
		</div>
	);
};

export const App = () => {
	return (
		<GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
			<AppContent />
		</GoogleOAuthProvider>
	);
};
