import { defineConfig, mergeConfig } from "vitest/config";
import { sharedConfig } from "../vite.config";
import { loadEnv } from "vite";

export const sharedTestConfig = mergeConfig(
	sharedConfig,
	defineConfig({
		test: {
			environment: "node",
			open: false,
			env: loadEnv("test", process.cwd(), ""),
			setupFiles: "./test/setup/setup.env.ts",
		},
	}),
);
