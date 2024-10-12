import { ValidateEnv as validateEnv } from "@julr/vite-plugin-validate-env";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, mergeConfig } from "vitest/config";
import { sharedConfig } from "./vite.config";

export default mergeConfig(
	sharedConfig,
	defineConfig({
		test: {
			open: false,
		},
	}),
);
