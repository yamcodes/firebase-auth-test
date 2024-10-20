import * as path from "node:path";
import { fileURLToPath } from "node:url";
import AutoLoad, { type AutoloadPluginOptions } from "@fastify/autoload";
import fastifyCors from "@fastify/cors";
import {
	type FastifyTRPCPluginOptions,
	fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import type { FastifyPluginAsync } from "fastify";
import { renderTrpcPanel } from "trpc-panel";
import { createContext } from "./context";
import { type AppRouter, appRouter } from "./router";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
	// Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
	fastify,
	opts,
): Promise<void> => {
	void fastify.register(fastifyCors);

	// Do not touch the following lines

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	void fastify.register(AutoLoad, {
		dir: path.join(__dirname, "plugins"),
		options: opts,
		forceESM: true,
	});

	// This loads all plugins defined in routes
	// define your routes in one of these
	void fastify.register(AutoLoad, {
		dir: path.join(__dirname, "routes"),
		options: opts,
		forceESM: true,
	});

	void fastify.register(fastifyTRPCPlugin, {
		prefix: "/trpc",
		trpcOptions: {
			router: appRouter,
			createContext,
			onError({ path, error }) {
				// report to error monitoring
				console.error(`Error in tRPC handler on path '${path}':`, error);
			},
		} satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
	});

	void fastify.get("/ping", (req, reply) => {
		reply.send({ msg: "pong" });
	});

	void fastify.get("/panel", (_, res) => {
		return res.header("content-type", "text/html").send(
			renderTrpcPanel(appRouter, {
				url: "http://localhost:1434/trpc",
				transformer: "superjson",
			}),
		);
	});
};

export default app;
export { app, options };
