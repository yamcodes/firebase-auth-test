import {
	FatAuthProvider,
	LoginButton,
	useAuth,
	useUser,
} from "@repo/fat-auth/react";
import { Button } from "@repo/fat-ui";
import { Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useEffectOnce } from "react-use";

const AppContent = () => {
	const [data, setData] = useState({});
	const { isLoading, isLoggedIn, user } = useUser();
	const { logout } = useAuth();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffectOnce(() => {
		void fetch("/api/legacy")
			.then((res) => res.json())
			.then((res) => {
				setData(res as Record<string, unknown>);
			});
	});

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	if (!mounted) return null;

	return (
		<div
			className={`flex flex-col min-h-screen ${
				theme === "light"
					? "bg-gradient-to-b from-gray-50 to-gray-200"
					: "bg-gradient-to-b from-gray-800 to-gray-900"
			}`}
		>
			<header
				className={`${theme === "light" ? "bg-white" : "bg-gray-800"} shadow-sm`}
			>
				<div className="container mx-auto px-4 py-6">
					<nav className="flex justify-between items-center">
						<div className="flex items-center space-x-4">
							<img className="h-8" src="/firebase.svg" alt="Firebase" />
							<span className="text-2xl font-bold">+</span>
							{/* <img className="h-8" src="/turborepo.svg" alt="Turborepo" /> */}
							{/* if light mode, show turborepo-dark.svg */}
							{theme === "light" ? (
								<img
									className="h-8"
									src="/turborepo-dark.svg"
									alt="Turborepo"
								/>
							) : (
								<img className="h-8" src="/turborepo.svg" alt="Turborepo" />
							)}
						</div>
						<div className="flex items-center space-x-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleTheme}
								aria-label="Toggle theme"
							>
								{theme === "dark" ? (
									<Sun className="h-5 w-5" />
								) : (
									<Moon className="h-5 w-5" />
								)}
							</Button>
							{isLoggedIn ? (
								<div className="flex items-center space-x-2">
									<img
										alt="User"
										src={user.photoURL ?? undefined}
										className="h-8 w-8 rounded-full"
									/>
									<span className="font-medium">{user.displayName}</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => void logout()}
									>
										Logout
									</Button>
								</div>
							) : (
								<LoginButton>
									<Button variant="default" size="sm">
										Login
									</Button>
								</LoginButton>
							)}
						</div>
					</nav>
				</div>
			</header>

			<main
				className={`container mx-auto px-4 py-12 flex-grow ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}
			>
				<section className="mb-12 text-center">
					<h1 className="text-4xl font-bold mb-4">
						Welcome to Firebase + Turborepo
					</h1>
					<p
						className={`text-xl ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
					>
						A powerful combination for modern web development 🔥🚀
					</p>
				</section>

				<section className="grid md:grid-cols-2 gap-8">
					<div
						className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
					>
						<h2 className="text-2xl font-semibold mb-4">API Data</h2>
						{isLoading ? (
							<p>Loading...</p>
						) : (
							<pre
								className={`p-4 rounded overflow-auto max-h-64 ${theme === "light" ? "bg-gray-100" : "bg-gray-700"}`}
							>
								{JSON.stringify(data, null, 2)}
							</pre>
						)}
					</div>
					<div
						className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
					>
						<h2 className="text-2xl font-semibold mb-4">User Information</h2>
						{isLoggedIn ? (
							<div>
								<p>
									<strong>Name:</strong> {user.displayName}
								</p>
								<p>
									<strong>Email:</strong> {user.email}
								</p>
							</div>
						) : (
							<p>Please log in to view your information.</p>
						)}
					</div>
				</section>
			</main>

			<footer
				className={`py-6 mt-auto ${theme === "light" ? "bg-gray-200 text-gray-600" : "bg-gray-800 text-gray-400"}`}
			>
				<div className="container mx-auto px-4 text-center">
					© 2023 Firebase + Turborepo. All rights reserved.
				</div>
			</footer>
		</div>
	);
};

export const App = () => {
	return (
		<FatAuthProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<AppContent />
			</ThemeProvider>
		</FatAuthProvider>
	);
};
