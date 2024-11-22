import { defineConfig } from "@julr/vite-plugin-validate-env";
import { z } from "zod";

/**
 * Schema to be validated against import.meta.env, validated by Vite
 *
 * Note: Every environment variable here must be prefixed with FAT_
 */
const envSchema = z.object({
	/**
	 * The port for the fat identity service. Defaults to 5173 or the next available port
	 */
	FAT_PORT: z.string().optional(),
	/**
	 * The log level
	 */
	FAT_LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "silent", "fatal"])
		.default("info"),
});

/**
 * Schema to be validated against process.env, unrelated to Vite validation
 */
export const processEnvSchema = z.object({
	/**
	 * Firebase config
	 * See: https://firebase.google.com/docs/admin/setup#initialize-sdk
	 */
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

export default defineConfig({
	validator: "zod",
	schema: envSchema.shape,
});
