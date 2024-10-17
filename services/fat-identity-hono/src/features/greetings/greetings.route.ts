import { HTTPException } from "hono/http-exception";
import { db } from "~/config/firebase";
import { createApp, createHandler } from "~/lib/hono";
import { GreetingConverter } from "./greetings.model";
import {
	getGreeting,
	getRandomGreeting,
	getSpecialGreeting,
} from "./greetings.service";
import {
	GreetingMessageResponse,
	Greeting,
	GreetingDto,
} from "./greetings.schema";
import { z } from "@hono/zod-openapi";

export const getHello = createHandler(
	{
		method: "get",
		path: "/hello/{name}",
		summary: "Get a hello greeting",
		description: "Use this endpoint to get a personalized hello greeting",
		tags: ["Greetings"],
		request: {
			params: z.object({
				name: z.string().openapi({
					description: "The name of the person to greet",
					example: "John",
				}),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: GreetingMessageResponse,
					},
				},
				description: "Successful response with a greeting message",
			},
		},
	},
	({ req, var: { logger }, json }) => {
		const { name } = req.valid("param");
		logger.debug(`Processing greeting request for ${name}`);
		const message = getGreeting(name);
		return json({ message }, 200);
	},
);

export const getSpecial = createHandler(
	{
		method: "get",
		path: "/special",
		summary: "Get a special greeting",
		description: "Retrieve a unique, special greeting",
		tags: ["Greetings"],
		responses: {
			200: {
				content: {
					"application/json": {
						schema: GreetingMessageResponse,
					},
				},
				description: "Successful response with a special greeting",
			},
		},
	},
	({ var: { logger }, json }) => {
		logger.debug("Processing special greeting request");
		const message = getSpecialGreeting();
		return json({ message }, 200);
	},
);

export const getGoodbye = createHandler(
	{
		method: "get",
		path: "/goodbye",
		summary: "Get a goodbye message",
		description: "Retrieve a farewell message",
		tags: ["Greetings"],
		responses: {
			200: {
				content: {
					"application/json": {
						schema: GreetingMessageResponse,
					},
				},
				description: "Successful response with a goodbye message",
			},
		},
	},
	({ json }) => {
		return json({ message: "Goodbye!" }, 200);
	},
);

export const getRandomGreetingHandler = createHandler(
	{
		method: "get",
		path: "/random/{name}",
		summary: "Get a random greeting",
		description: "Retrieve a random personalized greeting",
		tags: ["Greetings"],
		request: {
			params: z.object({
				name: z
					.string()
					.min(3, "Name must be at least 3 characters long")
					.openapi({
						description: "The name of the person to greet",
						example: "John",
					}),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: GreetingMessageResponse,
					},
				},
				description: "Successful response with a random greeting",
			},
		},
	},
	({ req, json }) => {
		const { name } = req.valid("param");
		const message = getRandomGreeting(name);
		return json({ message });
	},
);

export const postGreeting = createHandler(
	{
		method: "post",
		path: "/",
		summary: "Save a greeting",
		description:
			"Use this endpoint to save a new greeting. Use `%name` in the `greeting` field to include the name in the greeting.",
		tags: ["Greetings"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: GreetingDto,
					},
				},
			},
		},
		responses: {
			201: {
				content: {
					"application/json": {
						schema: Greeting,
					},
				},
				description: "Greeting created successfully",
			},
			500: {
				description: "Server error",
				content: {
					"application/json": {
						schema: z.object({
							message: z.string(),
						}),
					},
				},
			},
		},
	},
	async ({ req, json, var: { logger } }) => {
		const greetingDto = req.valid("json");
		const { name, greeting: rawGreeting } = greetingDto;
		const greeting = rawGreeting.replace("%name", name);
		logger.debug({ greetingDto }, "Saving greeting");
		const docRef = await db
			.collection("greetings")
			.withConverter(GreetingConverter)
			.add({
				name,
				greeting,
			});
		const result = await docRef.get();
		const resultData = result.data();
		if (!resultData) {
			throw new HTTPException(500, {
				message: "Failed to save greeting",
			});
		}
		logger.debug({ resultData }, "Greeting saved successfully");
		return json({ ...resultData, id: docRef.id }, 201);
	},
);

export const getGreetingById = createHandler(
	{
		method: "get",
		path: "/{id}",
		summary: "Get a saved greeting",
		description: "Retrieve a specific greeting by its ID",
		tags: ["Greetings"],
		request: {
			params: z.object({
				id: z.string().min(1, "ID is required").openapi({
					description: "The unique identifier of the greeting",
					example: "123",
				}),
			}),
		},
		responses: {
			200: {
				content: {
					"application/json": {
						schema: Greeting,
					},
				},
				description: "Greeting retrieved successfully",
			},
			404: {
				description: "Greeting not found",
				content: {
					"application/json": {
						schema: z.object({
							error: z.string(),
						}),
					},
				},
			},
		},
	},
	async ({ req, json }) => {
		const { id } = req.valid("param");
		const greeting = await db.collection("greetings").doc(id).get();
		if (greeting.exists) {
			return json(greeting.data());
		}
		throw new HTTPException(404, {
			message: "Greeting not found",
		});
	},
);

export const getAllGreetings = createHandler(
	{
		method: "get",
		path: "/",
		summary: "Get all greetings",
		description: "Retrieve all saved greetings",
		tags: ["Greetings"],
		responses: {
			200: {
				content: {
					"application/json": {
						schema: z.array(Greeting),
					},
				},
				description: "Successfully retrieved all greetings",
			},
		},
	},
	async ({ json, var: { logger } }) => {
		logger.debug("Retrieving all greetings");
		const greetingsSnapshot = await db
			.collection("greetings")
			.withConverter(GreetingConverter)
			.get();
		const greetings = greetingsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		logger.debug(
			{ greetingsCount: greetings.length },
			"Greetings retrieved successfully",
		);
		return json(greetings, 200);
	},
);

export const deleteAllGreetings = createHandler(
	{
		method: "delete",
		path: "/all",
		summary: "Delete all greetings",
		description: "Remove all saved greetings from the database",
		tags: ["Greetings"],
		responses: {
			204: {
				description: "All greetings deleted successfully",
			},
		},
	},
	async ({ var: { logger }, body }) => {
		logger.debug("Deleting all greetings");
		const greetingsSnapshot = await db
			.collection("greetings")
			.withConverter(GreetingConverter)
			.get();
		const batch = db.batch();
		for (const doc of greetingsSnapshot.docs) {
			batch.delete(doc.ref);
		}
		await batch.commit();
		const deletedCount = greetingsSnapshot.size;
		logger.debug({ deletedCount }, "All greetings deleted successfully");
		return body(null, 204);
	},
);

export const greetings = createApp()
	.openapi(...getHello)
	.openapi(...getSpecial)
	.openapi(...getGoodbye)
	.openapi(...getRandomGreetingHandler)
	.openapi(...postGreeting)
	.openapi(...getGreetingById)
	.openapi(...getAllGreetings)
	.openapi(...deleteAllGreetings);
