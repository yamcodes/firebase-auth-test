import type { Hono } from "hono";
import { GreetingsController } from "./greetings.controller";

export class GreetingsModule {
	constructor(app: Hono) {
		const greetingsController = new GreetingsController();
		app.get("/greetings/:name", greetingsController.getGreeting);
	}
}
