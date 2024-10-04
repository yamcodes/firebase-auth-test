import { parseEnv } from "znv";
import { z } from "zod";

export const env = parseEnv(import.meta.env, {
	VITE_GOOGLE_CLIENT_ID: z.string(),
});
