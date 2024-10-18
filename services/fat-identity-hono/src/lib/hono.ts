import { createRoute as createSchema, OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { formatZodErrors } from "~/utils";
import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";

/**
 * Create a Hono route with an OpenAPI schema.
 * @param path - The route path
 * @param config - The route configuration object
 * @param handler - The handler function for the route
 * @returns A tuple containing the route configuration and handler
 */
export function createRoute<
	const R extends Omit<RouteConfig, "path">,
	const P extends string,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P }>,
): [R & { path: P }, RouteHandler<R & { path: P }>] {
	return [createSchema({ ...config, path }), handler];
}

/**
 * Create HTTP method-specific routes with OpenAPI schema
 * @param method - The HTTP method
 * @param path - The route path
 * @param config - The route configuration object
 * @param handler - The handler function for the route
 * @returns A tuple containing the route configuration and handler
 */
function createMethodRoute<
	const M extends "get" | "post" | "put" | "delete" | "patch",
	const R extends Omit<RouteConfig, "path" | "method">,
	const P extends string,
>(
	method: M,
	path: P,
	config: R,
	handler: RouteHandler<R & { method: M; path: P }>,
): [R & { method: M; path: P }, RouteHandler<R & { method: M; path: P }>] {
	return [createSchema({ ...config, path, method }), handler];
}

/** Create a GET route */
export const createGet = <
	R extends Omit<RouteConfig, "path" | "method">,
	P extends string,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "get" }>,
) => createMethodRoute<"get", R, P>("get", path, config, handler);

/** Create a POST route */
export const createPost = <
	R extends Omit<RouteConfig, "path" | "method">,
	P extends string,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "post" }>,
) => createMethodRoute<"post", R, P>("post", path, config, handler);

/** Create a PUT route */
export const createPut = <
	R extends Omit<RouteConfig, "path" | "method">,
	P extends string,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "put" }>,
) => createMethodRoute<"put", R, P>("put", path, config, handler);

/** Create a DELETE route */
export const createDelete = <
	R extends Omit<RouteConfig, "path" | "method">,
	P extends string,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "delete" }>,
) => createMethodRoute<"delete", R, P>("delete", path, config, handler);

/** Create a PATCH route */
export const createPatch = <
	R extends Omit<RouteConfig, "path" | "method">,
	P extends string,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "patch" }>,
) => createMethodRoute<"patch", R, P>("patch", path, config, handler);

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
