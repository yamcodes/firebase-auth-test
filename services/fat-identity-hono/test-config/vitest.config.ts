import { loadEnv } from "vite";
import { defineProject, mergeConfig } from "vitest/config";
import { validateProcessEnv } from "../vite-plugins/vite-validate-process-env";
import { sharedConfig } from "../vite.config";
import { processEnvSchema } from "./env.config";

/**
 * Config used by each test script (union)
 */
export const sharedTestConfig = defineProject((configEnv) =>
	mergeConfig(
		sharedConfig(configEnv),
		defineProject({
			plugins: [validateProcessEnv(processEnvSchema)],
			test: {
				environment: "node",
				env: loadEnv("test", process.cwd(), ""),
			},
		}),
	),
);

/**
 * Config used by the master test script (intersection)
 */
export default defineProject((configEnv) =>
	mergeConfig(
		sharedTestConfig(configEnv),
		defineProject({
			test: {
				setupFiles: "./test-config/setup.e2e.ts",
				name: "fat-identity-hono",
				include: ["../test/**/*.test.ts", "../src/**/*.test.ts"],
			},
		}),
	),
);
