import { defineConfig, mergeConfig } from "vitest/config";
import { loadEnv } from "vite";
import { sharedTestConfig } from "./vitest.shared.config";

export default mergeConfig(
	sharedTestConfig,
	defineConfig({
		test: {
			setupFiles: "./test/setup.e2e.ts",
		},
	}),
);
