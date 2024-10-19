import { loadEnv } from "vite";
import { defineConfig, mergeConfig } from "vitest/config";
import { sharedConfig } from "./vite.config";

export default mergeConfig(
	sharedConfig,
	defineConfig({
		test: {
			environment: "node",
			setupFiles: "./test/setup.e2e.ts",
			env: loadEnv("test", process.cwd(), ""),
			include: ["test/e2e/**/*.test.ts", "src/**/*.e2e.test.ts"],
		},
	}),
);
