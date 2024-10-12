import { defineConfig, mergeConfig } from "vitest/config";
import { sharedConfig } from "./vite.config";

export default mergeConfig(
	sharedConfig,
	defineConfig({
		test: {
			open: false,
		},
	}),
);
