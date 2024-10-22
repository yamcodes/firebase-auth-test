import { defineConfig, mergeConfig } from "vitest/config";
import { sharedTestConfig } from "./vitest.config";

export default mergeConfig(
	sharedTestConfig,
	defineConfig({
		test: {
			include: [
				"test/integration/**/*.test.ts",
				"src/**/*.integration.test.ts",
			],
		},
	}),
);
