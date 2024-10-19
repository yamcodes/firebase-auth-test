import { defineConfig, mergeConfig } from "vitest/config";
import { sharedTestConfig } from "./vitest.config";

export default mergeConfig(
	sharedTestConfig,
	defineConfig({
		test: {
			include: ["test/unit/**/*.test.ts", "src/**/*.test.ts"],
			exclude: ["test/e2e/**/*.test.ts", "src/**/*.e2e.test.ts"],
		},
	}),
);
