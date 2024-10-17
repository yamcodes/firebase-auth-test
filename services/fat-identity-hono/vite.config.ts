import build from "@hono/vite-build/node";
import dev from "@hono/vite-dev-server";
import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import { type PluginOption, defineConfig, mergeConfig } from "vite";
import env from "vite-plugin-env-compatible";
import tsconfigPaths from "vite-tsconfig-paths";

const entry = "src/index.ts";

export const sharedConfig = defineConfig({
	plugins: [tsconfigPaths(), validateEnv({ configFile: "env.config" })],
	envPrefix: "FAT_",
});

export default mergeConfig(
	sharedConfig,
	/**
	 * Configuration for dev and build, but not test
	 */
	defineConfig({
		plugins: [
			/**
			 * Since we're using Vite in the server, this is required to support `process.env.XXX` variables for third-party libraries (like Firebase)
			 */
			env() as PluginOption,
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
