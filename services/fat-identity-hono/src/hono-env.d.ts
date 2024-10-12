import type { Env as HonoEnv } from "hono";

declare module "hono" {
	interface Env extends HonoEnv {
		Variables: {
			logger: Logger;
		};
	}
}
