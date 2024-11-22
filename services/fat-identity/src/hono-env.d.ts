import type { Env as HonoEnv } from "hono";
import type { Logger } from "~/utils";
import type { DatabaseInterface } from "./database";

declare module "hono" {
	interface Env extends HonoEnv {
		Variables: {
			logger: Logger;
		};
	}
}
