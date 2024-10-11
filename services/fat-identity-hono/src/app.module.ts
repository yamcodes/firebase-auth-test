import type { OpenAPIHono } from "@hono/zod-openapi";
import { GeneralModule } from "./features/general/general.module";
import { GreetingsModule } from "./features/greetings/greetings.module";
import { apiReference } from "@scalar/hono-api-reference";

export class AppModule {
	constructor(app: OpenAPIHono) {
		new GreetingsModule(app);
		new GeneralModule(app);
	}
}
