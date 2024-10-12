import { defineConfig } from "@julr/vite-plugin-validate-env";
import { z } from "zod";

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

export default defineConfig({
	validator: "zod",
	schema: envSchema.shape,
});
