import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { getGreeting, getSpecialGreeting } from "./greetings.service";

export const greetings = new OpenAPIHono()
	.openapi(
		createRoute({
			method: "get",
			path: "/{name}",
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
		({ req, var: { logger }, json }) => {
			const { name } = req.valid("param");
			logger.info(`Processing greeting request for ${name}`);
			const message = getGreeting(name);
			return json({ message });
		},
	)
	.openapi(
		createRoute({
			method: "get",
			path: "/special",
			summary: "Get a special greeting",
			tags: ["Greetings"],
			responses: {
				200: {
					description: "Successful response",
				},
			},
		}),
		({ var: { logger }, json }) => {
			logger.info("Processing special greeting request");
			const message = getSpecialGreeting();
			return json({ message });
		},
	);
