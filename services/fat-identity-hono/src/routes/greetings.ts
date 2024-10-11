import { createRoute, z } from "@hono/zod-openapi";

const sayMyNameSchema = z
	.object({ name: z.string().describe("The name to greet") })
	.strict();

export const sayMyNameV1Route = createRoute({
	method: "get",
	path: "/v1/misc/sayMyName",
	tags: ["Greetings"],
	summary: "Say my name (v1)",
	description: "Returns a greeting with the provided name",
	request: {
		query: sayMyNameSchema,
	},
	responses: {
		200: {
			content: {
				"text/plain": {
					schema: z.string(),
				},
			},
			description: "Successful response with a personalized greeting",
		},
	},
});

export const sayMyNameV2Route = createRoute({
	method: "get",
	path: "/v2/misc/sayMyName",
	tags: ["Greetings"],
	summary: "Say my name (v2)",
	description: "Returns an enthusiastic greeting with the provided name",
	request: {
		query: sayMyNameSchema,
	},
	responses: {
		200: {
			content: {
				"text/plain": {
					schema: z.string(),
				},
			},
			description:
				"Successful response with an enthusiastic personalized greeting",
		},
	},
});
