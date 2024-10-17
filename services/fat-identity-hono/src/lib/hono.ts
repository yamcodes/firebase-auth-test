import {
	createRoute,
	createRoute as createSchema,
	OpenAPIHono,
} from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { formatZodErrors } from "~/utils";
import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";

/**
 * Create a Hono handler with an OpenAPI schema.
 *
 * @template T - The type of the RouteConfig.
 * @param config - The route configuration object.
 * @param handler - The handler function for the route.
 * @returns A tuple containing the route configuration and handler.
 *
 * @example
 * ```ts
 * // The handler
 * const getHello = createHandler({
 * 	path: "/hello/{name}",
 * 	summary: "Get a hello greeting",
 * 	description: "Use this endpoint to get a personalized hello greeting",
 * 	tags: ["Greetings"],
 * }, ({ req, var: { logger }, json }) => {
 * 	const { name } = req.valid("param");
 * 	return json({ message: `Hello, ${name}!` });
 * });
 *
 * // Somewhere in your app
 * const app = createApp();
 * const routes = app.openapi(...getHello);
 * ```
 */
export function createHandler<T extends RouteConfig>(
	config: Readonly<T>,
	handler: RouteHandler<T>,
): [T, RouteHandler<T>] {
	return [createSchema(config), handler];
}

export const defaultHook: OpenAPIHono["defaultHook"] = (result, { json }) => {
	if (result.success) return;

	throw new HTTPException(422, {
		cause: result.error,
		res: json({
			errors: formatZodErrors(result),
		}),
	});
};

export const createApp = (
	init?: ConstructorParameters<typeof OpenAPIHono>[0],
) => {
	return new OpenAPIHono({ defaultHook, ...init });
};
