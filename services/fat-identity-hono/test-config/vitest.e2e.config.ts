import { defineConfig, mergeConfig } from "vitest/config";
import { sharedTestConfig } from "./vitest.config";

export default mergeConfig(
	sharedTestConfig,
	defineConfig({
		test: {
			setupFiles: "./test-config/setup.e2e.ts",
			include: ["test/e2e/**/*.test.ts", "src/**/*.e2e.test.ts"],
		},
	}),
);
