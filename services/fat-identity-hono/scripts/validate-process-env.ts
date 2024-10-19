import { z, type ZodObject } from "zod";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { envPrefix } from "../vite.config";
import { pino } from "pino";
import { pick } from "radashi";

const logger = pino({ level: "debug", transport: { target: "pino-pretty" } });

// biome-ignore lint/suspicious/noExplicitAny: any zod object
export function validateEnv(envSchema: ZodObject<any, any, any, any>) {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const rootDir = path.resolve(__dirname, "..");

		const envFileDir = process.env.VITEST
			? path.resolve(rootDir, ".env.test")
			: path.resolve(rootDir, ".env");

		dotenv.config({ path: envFileDir });

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
