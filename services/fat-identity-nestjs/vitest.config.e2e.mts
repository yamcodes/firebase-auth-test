import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.e2e-test.ts"],
		globals: true,
		root: "./",
	},
	plugins: [swc.vite(), tsconfigPaths()],
});