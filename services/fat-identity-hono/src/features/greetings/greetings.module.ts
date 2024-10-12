import type { OpenAPIHono } from "@hono/zod-openapi";
import { GreetingsController } from "./greetings.controller";
import { GreetingsService } from "./greetings.service";

export class GreetingsModule {
	constructor(private app: OpenAPIHono) {
		const greetingsService = new GreetingsService();
		const greetingsController = new GreetingsController(
			this.app,
			greetingsService,
		);
		greetingsController.registerRoutes();
	}
}
