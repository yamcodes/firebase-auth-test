import { OpenAPIHono, createRoute as createSchema } from "@hono/zod-openapi";
import type { RouteConfig, RouteHandler } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { formatZodErrors } from "~/utils";

function createRoute<
	const M extends "get" | "post" | "put" | "delete" | "patch",
	const P extends string,
	const R extends Omit<RouteConfig, "path" | "method">,
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
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "get" }>,
) => createRoute<"get", P, R>("get", path, config, handler);

/** Create a POST route */
export const createPost = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "post" }>,
) => createRoute<"post", P, R>("post", path, config, handler);

/** Create a PUT route */
export const createPut = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "put" }>,
) => createRoute<"put", P, R>("put", path, config, handler);

/** Create a DELETE route */
export const createDelete = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "delete" }>,
) => createRoute<"delete", P, R>("delete", path, config, handler);

/** Create a PATCH route */
export const createPatch = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: "patch" }>,
) => createRoute<"patch", P, R>("patch", path, config, handler);

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
