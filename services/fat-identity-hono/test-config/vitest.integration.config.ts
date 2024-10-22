import { defineConfig, mergeConfig } from "vitest/config";
import { sharedTestConfig } from "./vitest.config";

export default defineConfig((configEnv) =>
	mergeConfig(
		sharedTestConfig(configEnv),
		defineConfig({
			test: {
				include: [
					"test/integration/**/*.test.ts",
					"src/**/*.integration.test.ts",
				],
			},
		}),
	),
);
