import { defineConfig } from "vite";
import dev from "@hono/vite-dev-server";
import build from "@hono/vite-build/node";
import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";

const entry = "src/main.ts";

export default defineConfig({
	plugins: [
		dev({ entry }),
		build({ entry, emptyOutDir: true }),
		// validateEnv({ configFile: "config/env" }),
	],
	build: { rollupOptions: { input: entry } },
});
