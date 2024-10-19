import build from "@hono/vite-build/node";
import dev from "@hono/vite-dev-server";
import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import {
	type Plugin,
	type PluginOption,
	defineConfig,
	mergeConfig,
} from "vite";
import env from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import { validateEnv as validateProcessEnv } from "./scripts/validate-process-env";
import type { ZodObject } from "zod";
import { processEnvSchema } from "./env.config";

const entry = "src/index.ts";
export const envPrefix = "FAT_";

export const validateProcessEnvPlugin = (
	// biome-ignore lint/suspicious/noExplicitAny: any zod object
	envSchema: ZodObject<any, any, any, any>,
): Plugin => ({
	name: "validate-process-env",
	enforce: "pre",
	config: () => {
		validateProcessEnv(envSchema);
	},
});

export const sharedConfig = defineConfig({
	plugins: [
		tsconfigPaths(),
		/**
		 * Since we're using Vite in the server, this is required to support `process.env.XXX` variables for third-party libraries (like Firebase)
		 */
		env() as PluginOption,
		validateEnv({ configFile: "env.config" }),
		validateProcessEnvPlugin(processEnvSchema),
	],
	envPrefix,
});

export default mergeConfig(
	sharedConfig,
	/**
	 * Configuration for dev and build, but not test
	 */
	defineConfig({
		plugins: [
			/**
			 * Allow Vite to be used as the dev server for Hono (our server framework)
			 */
			dev({ entry }) as PluginOption,
			/**
			 * Allow Vite to build the Hono application
			 */
			build({ entry, emptyOutDir: false }) as PluginOption,
		],
		// We don't use rollup, this is just to silence a warning
		build: { rollupOptions: { input: entry } },
	}),
);
