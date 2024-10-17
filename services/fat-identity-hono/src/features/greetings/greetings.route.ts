import { createRoute } from "@hono/zod-openapi";
import { db } from "~/config/firebase";
import { z } from "zod";
import { createApp } from "~/lib/hono";
import {
	getGreeting,
	getRandomGreeting,
	getSpecialGreeting,
} from "./greetings.service";
import { HTTPException } from "hono/http-exception";

const GreetingDto = z.object({
	name: z
		.string({
			description: "The name of the person to greet",
		})
		.min(1, "Name is required")
		.openapi({
			examples: ["John", "Jane"],
		}),
	greeting: z
		.string()
		.min(1, "Greeting is required")
		.openapi({
			examples: ["Hello, %name!", "Welcome, %name!"],
			description: "Use %name to include the person's name in the greeting",
		}),
});
type GreetingDto = z.infer<typeof GreetingDto>;

// Schema for the response when creating a new greeting
const Greeting = GreetingDto.extend({
	id: z.string().openapi({
		examples: ["123", "456"],
		description: "Unique identifier for the greeting",
	}),
});
type Greeting = z.infer<typeof Greeting>;

// Converter for Firestore
const GreetingConverter = {
	toFirestore: (greeting: GreetingDto) => greeting,
	fromFirestore: (
		snapshot: FirebaseFirestore.QueryDocumentSnapshot,
	): Greeting => ({
		id: snapshot.id,
		...(snapshot.data() as GreetingDto),
	}),
};

// Common response schema for greeting messages
const GreetingMessageResponse = z
	.object({
		message: z.string(),
	})
	.openapi({
		description: "A greeting message",
		example: { message: "Hello, John!" },
	});

export const greetings = createApp()
	.openapi(
		createRoute({
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
		}),
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
	)
	.openapi(
		createRoute({
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
		}),
		async ({ req, json }) => {
			const { id } = req.valid("param");
			const greeting = await db.collection("greetings").doc(id).get();
			if (greeting.exists) {
				return json(greeting.data());
			}
			return json({ error: "Greeting not found" }, 404);
		},
	)
	.openapi(
		createRoute({
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
		}),
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
			return json(greetings);
		},
	)
	.openapi(
		createRoute({
			method: "delete",
			path: "/all",
			summary: "Delete all greetings",
			description: "Remove all saved greetings from the database",
			tags: ["Greetings"],
			responses: {
				200: {
					content: {
						"application/json": {
							schema: z.object({
								message: z.literal("All greetings deleted successfully"),
								deletedCount: z.number(),
							}),
						},
					},
					description: "All greetings deleted successfully",
				},
			},
		}),
		async ({ json, var: { logger } }) => {
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
			return json({
				message: "All greetings deleted successfully" as const,
				deletedCount,
			});
		},
	);
