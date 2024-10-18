import type { Env as HonoEnv } from "hono";
import type { DatabaseInterface } from "./features/database";
import type { Logger } from "~/utils";

declare module "hono" {
	interface Env extends HonoEnv {
		Variables: {
			logger: Logger;
			db: DatabaseInterface;
		};
	}
}
