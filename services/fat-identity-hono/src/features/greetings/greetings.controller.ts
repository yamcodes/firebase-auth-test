import { type OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import type { GreetingsService } from "./greetings.service";

export class GreetingsController {
	constructor(
		private app: OpenAPIHono,
		private greetingsService: GreetingsService,
	) {}

	public registerRoutes() {
		this.getGreeting();
		this.getSpecialGreeting();
	}

	private getGreeting() {
		this.app.openapi(
			createRoute({
				method: "get",
				path: "/greetings/{name}",
				summary: "Get a greeting",
				description:
					"Use this endpoint to get a greeting, but don't forget to replace the placeholder with a real name.",
				tags: ["Greetings"],
				request: {
					params: z.object({
						name: z.string(),
					}),
				},
				responses: {
					200: {
						content: {
							"application/json": {
								schema: z.object({
									message: z.string(),
								}),
								example: { message: "Hello, John!" },
							},
						},
						description: "Successful response",
					},
				},
			}),
			(c) => {
				const { name } = c.req.valid("param");
				const message = this.greetingsService.getGreeting(name);
				return c.json({ message });
			},
		);
	}

	private getSpecialGreeting() {
		this.app.openapi(
			createRoute({
				method: "get",
				path: "/greetings/special",
				summary: "Get a special greeting",
				tags: ["Greetings"],
				responses: {
					200: {
						description: "Successful response",
					},
				},
			}),
			(c) => {
				const message = this.greetingsService.getSpecialGreeting();
				return c.json({ message });
			},
		);
	}
}