import {
	FatAuthProvider,
	LoginButton,
	useAuth,
	useUser,
} from "@repo/fat-auth/react";
import { createClient } from "@repo/fat-identity-hono";
import { useForm } from "@tanstack/react-form";
import {
	QueryClient,
	QueryClientProvider,
	useMutation,
} from "@tanstack/react-query";
import { type InferRequestType, hc } from "hono/client";
import { Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { Button, Input, Toaster } from "./components";
import { useToast } from "./hooks";
import { services } from "./utils";
// TODO: get this from the server
type DogBreed = "Labrador" | "Corgi" | "Beagle" | "Golden Retriever";

const AppContent = () => {
	const { toast } = useToast();
	// hono
	const identityClient = createClient("localhost:5173");

	const form = useForm({
		defaultValues: { myName: "John" },
		onSubmit: async ({ value }) => {
			toast({
				title: "Name Said",
				description: await sayMyNameMutation.mutateAsync({
					name: value.myName,
				}),
			});
		},
	});

	const greetMe = useCallback(
		async (
			args: InferRequestType<
				(typeof identityClient.greetings)["random"][":name"]["$get"]
			>["param"],
		) => {
			const res = await identityClient.greetings.random[":name"].$get({
				param: {
					name: args.name,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to say name");
			}
			return (await res.json()).message;
		},
		[identityClient],
	);

	const sayMyNameMutation = useMutation({
		mutationFn: greetMe,
		onSuccess: (description) => {
			toast({ title: "Name Said", description });
		},
		onError: () => {
			toast({
				title: "Error",
				description: "Failed to say name. Please try again.",
				variant: "destructive",
			});
		},
	});

	const dogsQuery = services.identityNest.trpc.dogs.findAll.useQuery();
	const dogCreator = services.identityNest.trpc.dogs.create.useMutation();
	const identityHello = services.identity.trpc.getHello.useQuery();

	const [data, setData] = useState({});
	const { isLoading, isLoggedIn, user } = useUser();
	const { logout } = useAuth();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const [dogName, setDogName] = useState("");
	const [dogBreed, setDogBreed] = useState<DogBreed | undefined>();

	const nestUtils = services.identityNest.trpc.useUtils();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!dogName || !dogBreed) {
			// Validation error
			console.error("Dog name and breed are required");
			return;
		}
		dogCreator.mutate(
			{
				name: dogName,
				breed: dogBreed,
			},
			{
				onSuccess: () => {
					nestUtils.dogs.findAll.invalidate();
					setDogName("");
					setDogBreed(undefined);
				},
				onError: (error) => {
					console.error(error);
				},
			},
		);
	};

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
					<div
						className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
					>
						<h2 className="text-2xl font-semibold mb-4">
							Dogs (NestJS + tRPC)
						</h2>
						{dogsQuery.isLoading ? (
							<p>Loading...</p>
						) : (
							<ul>
								{dogsQuery.data?.map((dog) => (
									<li key={dog.id}>
										<b>{dog.name}</b> - {dog.breed}
									</li>
								))}
							</ul>
						)}
					</div>
					<div
						className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
					>
						<h2 className="text-2xl font-semibold mb-4">Add a Dog</h2>
						<form onSubmit={handleSubmit} className="space-y-4">
							<Input
								type="text"
								name="dogName"
								placeholder="Dog Name"
								value={dogName}
								onChange={(e) => setDogName(e.target.value)}
								className="w-full"
							/>
							<Input
								type="text"
								name="dogBreed"
								placeholder="Dog Breed"
								value={dogBreed}
								onChange={(e) => {
									// TODO: avoid this
									setDogBreed(e.target.value as DogBreed);
								}}
								className="w-full"
							/>
							<Button type="submit" className="w-full">
								Add Dog
							</Button>
						</form>
					</div>
					<div
						className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
					>
						<h2 className="text-2xl font-semibold mb-4">
							Identity (Fastify + tRPC)
						</h2>
						<p>{identityHello.data}</p>
					</div>
					<div
						className={`p-6 rounded-lg shadow-md ${
							theme === "light" ? "bg-white" : "bg-gray-800"
						}`}
					>
						<h2 className="text-2xl font-semibold mb-4">Say My Name (Hono)</h2>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								form.handleSubmit();
							}}
							className="space-y-4"
						>
							<form.Field name="myName">
								{(field) => (
									<Input
										type="text"
										placeholder="Enter your name"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								)}
							</form.Field>
							<Button type="submit" className="w-full">
								{sayMyNameMutation.isLoading ? "Saying..." : "Say My Name"}
							</Button>
						</form>
						{sayMyNameMutation.isError && (
							<p className="mt-4 text-red-500">
								<strong>Error:</strong> Failed to fetch data
							</p>
						)}
						{sayMyNameMutation.isSuccess && (
							<p className="mt-4">
								<strong>Result:</strong> {sayMyNameMutation.data}
							</p>
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

const honoQueryClient = new QueryClient();

export const App = () => {
	return (
		<FatAuthProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<services.identity.trpc.Provider
					client={services.identity.trpcClient}
					queryClient={services.identity.queryClient}
				>
					<QueryClientProvider
						client={services.identity.queryClient}
						context={services.identity.reactQueryContext}
					>
						<services.identityNest.trpc.Provider
							client={services.identityNest.trpcClient}
							queryClient={services.identityNest.queryClient}
						>
							<QueryClientProvider
								client={services.identityNest.queryClient}
								context={services.identityNest.reactQueryContext}
							>
								<QueryClientProvider client={honoQueryClient}>
									<AppContent />
									<Toaster />
								</QueryClientProvider>
							</QueryClientProvider>
						</services.identityNest.trpc.Provider>
					</QueryClientProvider>
				</services.identity.trpc.Provider>
				{/* </trpc.Provider>
				</nestTrpc.Provider> */}
			</ThemeProvider>
		</FatAuthProvider>
	);
};
