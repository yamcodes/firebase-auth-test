// TODO: This file needs work. While it works, `tsc` is struggling to infer the types which causes build issues.
// We can hack it by building using `tsc --declaration --emitDeclarationOnly`, ignore the error, and build the client using
// `tsup` where the config has `dts: false`. This is obviously not a long term solution.
// The correct solution is to properly type the returns of these functions.

// Necessary for the build to work, otherwise it throws 'this might not be portable'
import type {} from "@asteasolutions/zod-to-openapi";
import {
	type OpenAPIHono,
	createRoute as createSchema,
} from "@hono/zod-openapi";
import type {
	OpenAPIHonoOptions,
	RouteConfig,
	RouteHandler,
} from "@hono/zod-openapi";
import type { Env, Hono, Schema } from "hono";
import { createApp } from "./create-app";

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

export function createAppWithRoutes<
	E extends Env = Env,
	// biome-ignore lint/complexity/noBannedTypes: that's ok
	S extends Schema = {},
	BasePath extends string = "/",
>(init?: HonoInit<E>) {
	const app = createApp<E, S, BasePath>(init);
	const createRoute = createRouteFactory(app);

	return {
		app,
		routes: {
			get: <P extends string, R extends Omit<RouteConfig, "path" | "method">>(
				path: P,
				config: R,
				handler: RouteHandler<R & { path: P; method: "get" }, E>,
			) => createRoute<"get", P, R>("get", path, config, handler),
			post: <P extends string, R extends Omit<RouteConfig, "path" | "method">>(
				path: P,
				config: R,
				handler: RouteHandler<R & { path: P; method: "post" }, E>,
			) => createRoute<"post", P, R>("post", path, config, handler),
			put: <P extends string, R extends Omit<RouteConfig, "path" | "method">>(
				path: P,
				config: R,
				handler: RouteHandler<R & { path: P; method: "put" }, E>,
			) => createRoute<"put", P, R>("put", path, config, handler),
			delete: <
				P extends string,
				R extends Omit<RouteConfig, "path" | "method">,
			>(
				path: P,
				config: R,
				handler: RouteHandler<R & { path: P; method: "delete" }, E>,
			) => createRoute<"delete", P, R>("delete", path, config, handler),
			patch: <P extends string, R extends Omit<RouteConfig, "path" | "method">>(
				path: P,
				config: R,
				handler: RouteHandler<R & { path: P; method: "patch" }, E>,
			) => createRoute<"patch", P, R>("patch", path, config, handler),
		},
	};
}
