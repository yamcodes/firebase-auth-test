import { defineConfig, mergeConfig } from "vitest/config";
import { sharedTestConfig } from "./vitest.shared.config";

export default mergeConfig(
	sharedTestConfig,
	defineConfig({
		test: {
			setupFiles: "./test/setup/setup.e2e.ts",
		},
	}),
);
