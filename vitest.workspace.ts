import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	"{services,packages,apps}/*/vitest.config.ts",
	"{services,packages,apps}/*/vitest.config.{e2e,integration}.ts",
	"{services,packages,apps}/*/test-config/vitest.config.{e2e,integration}.ts",
	"{services,packages,apps}/*/test-config/vitest.config.ts",
]);
