import { loadEnv } from "vite";
import { defineConfig, mergeConfig } from "vitest/config";
import { validateProcessEnv } from "../plugins/vite-validate-process-env";
import { sharedConfig } from "../vite.config";
import { processEnvSchema } from "./env.config";

/**
 * Config used by each test script (union)
 */
export const sharedTestConfig = mergeConfig(
	sharedConfig,
	defineConfig({
		plugins: [validateProcessEnv(processEnvSchema)],
		test: {
			environment: "node",
			open: false,
			env: loadEnv("test", process.cwd(), ""),
			mockReset: true,
		},
	}),
);

/**
 * Config used by the master test script (intersection)
 */
export default mergeConfig(
	sharedTestConfig,
	defineConfig({
		test: {
			setupFiles: "./test-config/setup.e2e.ts",
		},
	}),
);
