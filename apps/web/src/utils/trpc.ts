import type { AppRouter } from "@repo/fat-identity-fastify";
import type { AppRouter as NestAppRouter } from "@repo/fat-identity-nestjs";
import { QueryClient } from "@tanstack/react-query";
import {
	createTRPCClient,
	createTRPCReact,
	httpBatchLink,
} from "@trpc/react-query";
import { createContext } from "react";

export const createQueryClient = () => new QueryClient();

// export const nestTrpc = createTRPCReact<NestAppRouter>();
// export const trpc = createTRPCReact<AppRouter>();

export const services = {
	identity: (() => {
		const reactQueryContext = createContext<QueryClient | undefined>(undefined);
		return {
			trpc: createTRPCReact<AppRouter>({
				context: createContext(null),
				reactQueryContext,
			}),
			queryClient: createQueryClient(),
			reactQueryContext,
			trpcClient: createTRPCClient<AppRouter>({
				links: [httpBatchLink({ url: "http://localhost:1434/trpc" })],
			}),
		};
	})(),
	identityNest: (() => {
		const reactQueryContext = createContext<QueryClient | undefined>(undefined);
		return {
			trpc: createTRPCReact<NestAppRouter>({
				context: createContext(null),
				reactQueryContext,
			}),
			queryClient: createQueryClient(),
			reactQueryContext,
			trpcClient: createTRPCClient<NestAppRouter>({
				links: [httpBatchLink({ url: "http://localhost:3030/trpc" })],
			}),
		};
	})(),
};
