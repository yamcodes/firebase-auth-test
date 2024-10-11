import build from "@hono/vite-build/node";
import dev from "@hono/vite-dev-server";
import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import { defineConfig } from "vite";

const entry = "src/main.ts";

export default defineConfig({
	plugins: [
		dev({ entry }),
		build({ entry, emptyOutDir: true }),
		// validateEnv({ configFile: "config/env" }),
	],
	build: { rollupOptions: { input: entry } },
});
