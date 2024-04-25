import { z } from 'zod';
import { parseEnv } from 'znv';

export const env = parseEnv(import.meta.env, {
  VITE_GOOGLE_CLIENT_ID: z.string(),
});
