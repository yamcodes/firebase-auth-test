import { OpenAPIHono, createRoute as createSchema } from "@hono/zod-openapi";
import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { formatZodErrors } from "~/utils";

/**
 * Create a Hono route with an OpenAPI schema.
 * @param path - The route path
 * @param config - The route configuration object
 * @param handler - The handler function for the route
 * @returns A tuple containing the route configuration and handler
 */
export function createRoute<
	const P extends string,
	const R extends Omit<RouteConfig, "path">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P }>,
): [R & { path: P }, RouteHandler<R & { path: P }>] {
	return [createSchema({ ...config, path }), handler];
}

function createMethodRoute<
	const M extends "get" | "post" | "put" | "delete" | "patch",
	const P extends string,
	const R extends Omit<RouteConfig, "path" | "method">,
>(
	method: M,
	path: P,
	config: R,
	handler: RouteHandler<R & { method: M; path: P }>,
): [R & { method: M; path: P }, RouteHandler<R & { method: M; path: P }>] {
	return createRoute(
		path,
		{
			...config,
			method,
			path,
		},
		handler,
	);
}

/** Create a GET route */
export const createGet = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "get" }>,
) => createMethodRoute<"get", P, R>("get", path, config, handler);

/** Create a POST route */
export const createPost = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "post" }>,
) => createMethodRoute<"post", P, R>("post", path, config, handler);

/** Create a PUT route */
export const createPut = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "put" }>,
) => createMethodRoute<"put", P, R>("put", path, config, handler);

/** Create a DELETE route */
export const createDelete = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "delete" }>,
) => createMethodRoute<"delete", P, R>("delete", path, config, handler);

/** Create a PATCH route */
export const createPatch = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "patch" }>,
) => createMethodRoute<"patch", P, R>("patch", path, config, handler);

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
