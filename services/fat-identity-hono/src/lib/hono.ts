import { OpenAPIHono, createRoute as createSchema } from "@hono/zod-openapi";
import type {
	OpenAPIHonoOptions,
	RouteConfig,
	RouteHandler,
} from "@hono/zod-openapi";
import type { Env, Hono, Schema } from "hono";
import { HTTPException } from "hono/http-exception";
import { formatZodErrors } from "~/utils";
// Necessary for the build to work, otherwise it throws 'this might not be portable'
import type {} from "@asteasolutions/zod-to-openapi";

type HonoInit<E extends Env> = ConstructorParameters<typeof Hono>[0] &
	OpenAPIHonoOptions<E>;

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

function createRouteFactory<
	E extends Env,
	S extends Schema,
	BasePath extends string,
>(app: OpenAPIHono<E, S, BasePath>) {
	return <
		M extends HttpMethod,
		P extends string,
		R extends Omit<RouteConfig, "path" | "method">,
	>(
		method: M,
		path: P,
		config: R,
		handler: RouteHandler<R & { method: M; path: P }, E>,
		// biome-ignore lint/suspicious/noExplicitAny: .
	) => app.openapi(createSchema({ ...config, path, method }), handler as any);
}

// Update the RouteCreator type
type RouteCreator<E extends Env, M extends HttpMethod> = <
	P extends string,
	R extends Omit<RouteConfig, "path" | "method">,
>(
	path: P,
	config: R,
	handler: RouteHandler<R & { path: P; method: M }, E>,
) => ReturnType<ReturnType<typeof createRouteFactory<E, Schema, string>>>;

export function createAppWithRoutes<
	E extends Env = Env,
	// biome-ignore lint/complexity/noBannedTypes: that's ok
	S extends Schema = {},
	BasePath extends string = "/",
>(
	init?: HonoInit<E>,
): {
	app: OpenAPIHono<E, S, BasePath>;
	get: <P extends string>(
		path: P,
		config: Omit<RouteConfig, "path" | "method">,
		handler: RouteHandler<
			{
				path: P;
				method: "get";
			} & Omit<RouteConfig, "path" | "method">,
			E
		>,
	) => ReturnType<RouteCreator<E, "get">>;
	post: <P extends string>(
		path: P,
		config: Omit<RouteConfig, "path" | "method">,
		handler: RouteHandler<
			{
				path: P;
				method: "post";
			} & Omit<RouteConfig, "path" | "method">,
			E
		>,
	) => ReturnType<RouteCreator<E, "post">>;
	put: <P extends string>(
		path: P,
		config: Omit<RouteConfig, "path" | "method">,
		handler: RouteHandler<
			{
				path: P;
				method: "put";
			} & Omit<RouteConfig, "path" | "method">,
			E
		>,
	) => ReturnType<RouteCreator<E, "put">>;
	delete: <P extends string>(
		path: P,
		config: Omit<RouteConfig, "path" | "method">,
		handler: RouteHandler<
			{
				path: P;
				method: "delete";
			} & Omit<RouteConfig, "path" | "method">,
			E
		>,
	) => ReturnType<RouteCreator<E, "delete">>;
	patch: <P extends string>(
		path: P,
		config: Omit<RouteConfig, "path" | "method">,
		handler: RouteHandler<
			{
				path: P;
				method: "patch";
			} & Omit<RouteConfig, "path" | "method">,
			E
		>,
	) => ReturnType<RouteCreator<E, "patch">>;
} {
	const app = createApp<E, S, BasePath>(init);
	const createRoute = createRouteFactory(app);

	return {
		app,
		// Update the type assertions for each method
		get: <P extends string>(
			path: P,
			config: Omit<RouteConfig, "path" | "method">,
			handler: RouteHandler<
				{ path: P; method: "get" } & Omit<RouteConfig, "path" | "method">,
				E
			>,
		) =>
			createRoute("get", path, config, handler) as ReturnType<
				RouteCreator<E, "get">
			>,
		post: <P extends string>(
			path: P,
			config: Omit<RouteConfig, "path" | "method">,
			handler: RouteHandler<
				{ path: P; method: "post" } & Omit<RouteConfig, "path" | "method">,
				E
			>,
		) =>
			createRoute("post", path, config, handler) as ReturnType<
				RouteCreator<E, "post">
			>,
		put: <P extends string>(
			path: P,
			config: Omit<RouteConfig, "path" | "method">,
			handler: RouteHandler<
				{ path: P; method: "put" } & Omit<RouteConfig, "path" | "method">,
				E
			>,
		) =>
			createRoute("put", path, config, handler) as ReturnType<
				RouteCreator<E, "put">
			>,
		delete: <P extends string>(
			path: P,
			config: Omit<RouteConfig, "path" | "method">,
			handler: RouteHandler<
				{ path: P; method: "delete" } & Omit<RouteConfig, "path" | "method">,
				E
			>,
		) =>
			createRoute("delete", path, config, handler) as ReturnType<
				RouteCreator<E, "delete">
			>,
		patch: <P extends string>(
			path: P,
			config: Omit<RouteConfig, "path" | "method">,
			handler: RouteHandler<
				{ path: P; method: "patch" } & Omit<RouteConfig, "path" | "method">,
				E
			>,
		) =>
			createRoute("patch", path, config, handler) as ReturnType<
				RouteCreator<E, "patch">
			>,
	};
}

export const createApp = <
	E extends Env = Env,
	// biome-ignore lint/complexity/noBannedTypes: it's fine
	S extends Schema = {},
	BasePath extends string = "/",
>(
	init?: HonoInit<E>,
) => {
	return new OpenAPIHono<E, S, BasePath>({
		defaultHook: (result, { json }) => {
			if (result.success) return;

			throw new HTTPException(422, {
				cause: result.error,
				res: json({
					errors: formatZodErrors(result),
				}),
			});
		},
		...init,
	});
};
