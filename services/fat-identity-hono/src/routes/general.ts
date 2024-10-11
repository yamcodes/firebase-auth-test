import { createRoute, z } from "@hono/zod-openapi";

export const rootRoute = createRoute({
	method: "get",
	path: "/",
	tags: ["General"],
	summary: "Welcome message",
	description: "Returns a friendly welcome message for the API",
	responses: {
		200: {
			content: {
				"text/plain": {
					schema: z.string(),
				},
			},
			description: "Successful response with welcome message",
		},
	},
});
