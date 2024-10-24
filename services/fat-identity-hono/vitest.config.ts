import { loadEnv } from "vite";
import { defineConfig, mergeConfig } from "vitest/config";
import { validateProcessEnv } from "./vite-plugins/vite-validate-process-env";
import { sharedConfig } from "./vite.config";
import { processEnvSchema } from "./test-config/env.config";

/**
 * Config used by each test script (union)
 */
export const sharedTestConfig = defineConfig((configEnv) =>
	mergeConfig(
		sharedConfig(configEnv),
		defineConfig({
			plugins: [validateProcessEnv(processEnvSchema)],
			test: {
				environment: "node",
				open: false,
				env: loadEnv("test", process.cwd(), ""),
			},
		}),
	),
);

/**
 * Config used by the master test script (intersection)
 */
export default defineConfig((configEnv) =>
	mergeConfig(
		sharedTestConfig(configEnv),
		defineConfig({ test: { setupFiles: "./test-config/setup.e2e.ts" } }),
	),
);
