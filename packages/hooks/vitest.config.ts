import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["**/*.spec.ts", "**/*.spec.tsx"],
		globals: true,
		environment: "jsdom",
		restoreMocks: true,
	},
});
