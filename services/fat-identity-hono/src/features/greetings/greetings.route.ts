import { createRoute } from "@hono/zod-openapi";
import { db } from "~/config/firebase";
import { z } from "zod";
import { createApp } from "~/lib/hono";
import {
	getGreeting,
	getRandomGreeting,
	getSpecialGreeting,
} from "./greetings.service";

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
					name: z.string().min(3, "Name must be at least 3 characters long"),
				}),
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.object({ message: z.string() }),
							example: { message: "Hello, John!" },
						},
					},
					description: "Successful response",
				},
			},
		}),
		({ req, json }) => {
			const { name } = req.valid("param");
			const message = getRandomGreeting(name);
			return json({ message });
		},
	)
	.openapi(
		createRoute({
			method: "post",
			path: "/",
			summary: "Save a greeting",
			tags: ["Greetings"],
			request: {
				body: {
					content: {
						"application/json": {
							schema: z.object({
								name: z.string().min(1, "Name is required"),
								greeting: z.string().min(1, "Greeting is required"),
							}),
						},
					},
				},
			},
			responses: {
				201: {
					content: {
						"application/json": {
							schema: z.object({
								id: z.string(),
								name: z.string(),
								greeting: z.string(),
							}),
						},
					},
					description: "Greeting created successfully",
				},
			},
		}),
		async ({ req, json, var: { logger } }) => {
			const greetingDto = req.valid("json");
			logger.debug({ greetingDto }, "Saving greeting");
			const docRef = await db.collection("greetings").add(greetingDto);
			return json({ id: docRef.id, ...greetingDto }, 201);
		},
	)
	.openapi(
		createRoute({
			method: "get",
			path: "/{id}",
			summary: "Get a saved greeting",
			tags: ["Greetings"],
			request: {
				params: z.object({
					id: z.string().min(1, "ID is required"),
				}),
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.object({
								name: z.string(),
								greeting: z.string(),
							}),
						},
					},
					description: "Greeting retrieved successfully",
				},
				404: {
					description: "Greeting not found",
				},
			},
		}),
		async ({ req, json }) => {
			const { id } = req.valid("param");
			const greeting = await db.collection("greetings").doc(id).get();
			if (greeting.exists) {
				return json(greeting.data());
			}
			return json({ error: "Greeting not found" }, 404);
		},
	);
