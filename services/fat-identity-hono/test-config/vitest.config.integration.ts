import { defineProject, mergeConfig } from "vitest/config";
import { sharedTestConfig } from "./vitest.config";

export default defineProject((configEnv) =>
	mergeConfig(
		sharedTestConfig(configEnv),
		defineProject({
			test: {
				include: [
					"../test/integration/**/*.test.ts",
					"../src/**/*.integration.test.ts",
				],
				name: "fat-identity-hono.integration",
			},
		}),
	),
);
