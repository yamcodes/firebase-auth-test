import { defineProject, mergeConfig } from "vitest/config";
import sharedTestConfig from "./vitest.config.shared";

export default defineProject((configEnv) =>
	mergeConfig(
		sharedTestConfig(configEnv),
		defineProject({
			test: {
				setupFiles: "./test-config/setup.e2e.ts",
				include: ["../test/e2e/**/*.test.ts", "../src/**/*.e2e.test.ts"],
				name: "fat-identity-hono.e2e",
			},
		}),
	),
);
