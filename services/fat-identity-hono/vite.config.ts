import build from "@hono/vite-build/node";
import dev from "@hono/vite-dev-server";
import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import { type PluginOption, defineConfig, mergeConfig } from "vite";
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
			dev({ entry }) as PluginOption,
			build({ entry, emptyOutDir: true }) as PluginOption,
		],
		// We don't use rollup, this is just to silence a warning
		build: { rollupOptions: { input: entry } },
	}),
);
