import build from "@hono/vite-build/node";
import dev from "@hono/vite-dev-server";
import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import { type PluginOption, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const entry = "src/index.ts";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
		dev({ entry }) as PluginOption,
		build({ entry, emptyOutDir: true }) as PluginOption,
		validateEnv({ configFile: "env.config" }),
	],
	// We don't use rollup, this is just to silence a warning
	build: { rollupOptions: { input: entry } },
	envPrefix: "FAT_",
});
