import type { Context } from "hono";
import { z } from "zod";
import { createRoute, type OpenAPIHono } from "@hono/zod-openapi";

export class GreetingsController {
	public getGreetingRoute = createRoute({
		method: "get",
		path: "/greetings/{name}",
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
					},
				},
				description: "Successful response",
			},
		},
	});

	public registerRoutes(app: OpenAPIHono) {
		app.openapi(this.getGreetingRoute, (c) => {
			const { name } = c.req.valid("param");
			return c.json({ message: `Hello, ${name}!` });
		});
	}
}
