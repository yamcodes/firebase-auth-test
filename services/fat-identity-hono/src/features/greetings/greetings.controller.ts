import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import { z } from "zod";

export class GreetingsController {
	getGreeting = createRoute({
		method: "get",
		path: "/greetings/{name}",
		request: {
			params: z.object({
				name: z.string().min(1).max(50),
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
		handler: (c: Context) => {
			const { name } = c.req.valid("param");
			return c.json({ message: `Hello, ${name}!` });
		},
	});
}
