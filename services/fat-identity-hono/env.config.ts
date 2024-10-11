import { defineConfig } from "@julr/vite-plugin-validate-env";
import { z } from "zod";

const envSchema = z.object({
	/**
	 * The port for the fat identity service
	 */
	FAT_PORT: z.string().optional(),
});

export default defineConfig({
	validator: "zod",
	schema: envSchema.shape,
});
