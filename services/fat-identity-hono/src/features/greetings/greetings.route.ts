import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import {
	getGreeting,
	getRandomGreeting,
	getSpecialGreeting,
} from "./greetings.service";
import { createApp } from "~/lib/hono";

export const greetings = createApp()
	.openapi(
		createRoute({
			method: "get",
			path: "/hello/{name}",
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
			logger.debug(`Processing greeting request for ${name}`);
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
			logger.debug("Processing special greeting request");
			const message = getSpecialGreeting();
			return json({ message });
		},
	)
	.openapi(
		createRoute({
			method: "get",
			path: "/goodbye",
			summary: "Get a goodbye message",
			tags: ["Greetings"],
			responses: {
				200: { description: "Successful response" },
			},
		}),
		({ json }) => {
			return json({ message: "Goodbye!" });
		},
	)
	.openapi(
		createRoute({
			method: "get",
			path: "/random/{name}",
			summary: "Get a random greeting",
			tags: ["Greetings"],
			request: {
				params: z.object({
					name: z.string().min(3, "You must provide a name"),
				}),
			},
			responses: {
				200: {
					content: {
						"application/json": { schema: z.object({ message: z.string() }) },
					},
					description: "Successful response",
				},
				// 422: {
				// 	content: {
				// 		"application/json": {
				// 			schema: z.object({
				// 				code: z.number().openapi({ example: 422 }),
				// 				message: z.string().openapi({ example: "Validation Error" }),
				// 			}),
				// 		},
				// 	},
				// 	description: "Validation error",
				// },
			},
		}),
		({ req, var: { logger }, json }) => {
			const { name } = req.valid("param");
			const message = getRandomGreeting(name);
			return json({ message });
		},
	);
