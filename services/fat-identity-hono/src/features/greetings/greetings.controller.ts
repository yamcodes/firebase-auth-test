import { type OpenAPIHono, createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { z } from "zod";

export class GreetingsController {
	constructor(private app: OpenAPIHono) {}

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
				return c.json({ message: `Hello, ${name}!` });
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
				return c.json({ message: "Hello, special person!" });
			},
		);
	}
}
