import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths(), validateEnv({ configFile: "env.config" })],
	envPrefix: "FAT_",
	test: {
		open: false,
	},
});
