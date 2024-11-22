import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config as initializeDotenv } from "dotenv";
import { type Level, pino } from "pino";
import { pick } from "radashi";
import type { Plugin } from "vite";
import { type ZodObject, z } from "zod";
import { envPrefix } from "../vite.config";

export type ValidateEnvOptions = {
	logLevel?: Level;
};

function validateEnv(
	// biome-ignore lint/suspicious/noExplicitAny: any zod object
	envSchema: ZodObject<any, any, any, any>,
	{ logLevel = "info" }: ValidateEnvOptions = {},
) {
	const logger = pino({
		level: logLevel,
		transport: { target: "pino-pretty" },
	});
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = dirname(__filename);
		const rootDir = resolve(__dirname, "..");

		initializeDotenv(
			process.env.VITEST ? { path: resolve(rootDir, ".env.test") } : undefined,
		);

		const filteredEnv = pick(
			process.env,
			(_, key) => typeof key === "string" && !key.startsWith(envPrefix),
		);

		return envSchema.parse(filteredEnv);
	} catch (error) {
		if (error instanceof z.ZodError) {
			logger.error(error.errors, "Environment validation failed");
			throw error;
		}
		logger.error(error, "Unexpected error during environment validation");
		throw error;
	}
}

/**
 * Validate `process.env` variables against a Zod schema.
 *
 * Note that this is different than `@julr/vite-plugin-validate-env` which validates prefixed `import.meta.env` variables.
 */
export function validateProcessEnv(
	...args: Parameters<typeof validateEnv>
): Plugin {
	return {
		name: "validate-process-env",
		enforce: "pre",
		config: () => {
			validateEnv(...args);
		},
	};
}
