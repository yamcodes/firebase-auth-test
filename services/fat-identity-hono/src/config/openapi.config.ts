import { OpenAPIHono } from "@hono/zod-openapi";

export const openApiConfig = {
	openapi: "3.0.0",
	info: {
		title: "Fat Identity Hono API",
		version: "1.0.0",
	},
};

export const openApiHono = new OpenAPIHono();
