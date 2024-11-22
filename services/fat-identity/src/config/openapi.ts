import type { OpenAPIObjectConfigure } from "@hono/zod-openapi";
import type { Env } from "hono";

const baseUrl = import.meta.env.BASE_URL;

export const openapiConfig = {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Fat Identity API",
		description: "API for managing identity and greetings",
		contact: {
			name: "fat support",
			email: "support@example.com",
		},
	},
	servers: [
		{
			url: baseUrl,
			description: "Local server",
		},
		{
			url: "https://api.example.com",
			description: "Production server",
		},
		{
			url: "https://staging-api.example.com",
			description: "Staging server",
		},
	],
	tags: [
		{
			name: "General",
			description: "General endpoints",
		},
		{
			name: "Greetings",
			description: "Endpoints for personalized greetings",
		},
	],
} satisfies OpenAPIObjectConfigure<Env, string>;
