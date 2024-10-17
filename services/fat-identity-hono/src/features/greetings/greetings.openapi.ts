import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import {
	Greeting,
	GreetingDto,
	GreetingMessageResponse,
} from "./greetings.schema";

export const getHelloRoute = createRoute({
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
});

export const getSpecialRoute = createRoute({
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
});

export const getGoodbyeRoute = createRoute({
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
});

export const getRandomGreetingRoute = createRoute({
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
});

export const postGreetingRoute = createRoute({
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
});

export const getGreetingRoute = createRoute({
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
});

export const getAllGreetingsRoute = createRoute({
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
});

export const deleteAllGreetingsRoute = createRoute({
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
});
