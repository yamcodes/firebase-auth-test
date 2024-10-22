import { defineConfig, mergeConfig } from "vitest/config";
import { sharedTestConfig } from "./vitest.config";

export default defineConfig((configEnv) =>
	mergeConfig(
		sharedTestConfig(configEnv),
		defineConfig({
			test: {
				setupFiles: "./test-config/setup.e2e.ts",
				include: ["test/e2e/**/*.test.ts", "src/**/*.e2e.test.ts"],
			},
		}),
	),
);
