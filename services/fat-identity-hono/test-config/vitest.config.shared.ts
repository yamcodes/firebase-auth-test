import { loadEnv } from "vite";
import { defineProject, mergeConfig } from "vitest/config";
import { validateProcessEnv } from "../vite-plugins/vite-validate-process-env";
import { sharedConfig } from "../vite.config";
import { processEnvSchema } from "./env.config";

export default defineProject((configEnv) =>
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
