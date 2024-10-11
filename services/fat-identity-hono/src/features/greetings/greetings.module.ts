import type { OpenAPIHono } from "@hono/zod-openapi";
import { GreetingsController } from "./greetings.controller";

export class GreetingsModule {
	constructor(app: OpenAPIHono) {
		const greetingsController = new GreetingsController();
		app.openapi(greetingsController.getGreeting);
	}
}
