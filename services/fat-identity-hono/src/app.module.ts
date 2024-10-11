import type { OpenAPIHono } from "@hono/zod-openapi";
import { GeneralModule } from "./features/general/general.module";
import { GreetingsModule } from "./features/greetings/greetings.module";
import { apiReference } from "@scalar/hono-api-reference";

export class AppModule {
	constructor(app: OpenAPIHono) {
		new GreetingsModule(app);
		new GeneralModule(app);

		// Add OpenAPI documentation endpoint
		app.doc("/docs", {
			openapi: "3.0.0",
			info: {
				title: "My API",
				version: "1.0.0",
			},
		});

		app.get(
			"/reference",
			apiReference({
				spec: {
					url: "/docs",
				},
			}),
		);
	}
}
