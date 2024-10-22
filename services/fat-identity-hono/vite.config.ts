import build from "@hono/vite-build/node";
import dev from "@hono/vite-dev-server";
import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import { type PluginOption, defineConfig, mergeConfig } from "vite";
import env from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";
import { processEnvSchema } from "./env.config";
import { validateProcessEnv } from "./vite-plugins/vite-validate-process-env";

const entry = "src/index.ts";
export const envPrefix = "FAT_";

export const sharedConfig = defineConfig({
	plugins: [
		tsconfigPaths(),
		/**
		 * Since we're using Vite in the server, this is required to support `process.env.XXX` variables for third-party libraries (like Firebase)
		 */
		env() as PluginOption,
		validateEnv({ configFile: "env.config" }),
		validateProcessEnv(processEnvSchema),
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
