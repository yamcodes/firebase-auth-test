import { z } from "zod";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { envPrefix } from "../vite.config";
import { pino } from "pino";
import { pick } from "radashi";

const logger = pino({ level: "debug", transport: { target: "pino-pretty" } });

try {
	// Determine __dirname in ES modules
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const rootDir = path.resolve(__dirname, "..");

	const envFileDir = process.argv[2] || path.resolve(rootDir, ".env");

	dotenv.config({ path: envFileDir });

	const envSchema = z.object({
		FIREBASE_CONFIG: z.preprocess(
			(val) => {
				if (typeof val !== "string") return val;
				try {
					return JSON.parse(val);
				} catch {
					return val;
				}
			},
			z.object({
				projectId: z.string(),
			}),
		),
	});

	const filteredEnv = pick(
		process.env,
		(_, key) => typeof key === "string" && !key.startsWith(envPrefix),
	);

	envSchema.parse(filteredEnv);
} catch (error) {
	if (error instanceof z.ZodError) {
		logger.error(error.errors, "Environment validation failed");
		process.exit(1);
	}
	logger.error(error, "Unexpected error during environment validation");
}
