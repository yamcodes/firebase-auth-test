// Necessary for the build to work, otherwise it throws 'this might not be portable'
import type {} from "@asteasolutions/zod-to-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { OpenAPIHonoOptions } from "@hono/zod-openapi";
import type { Env, Hono, Schema } from "hono";
import { HTTPException } from "hono/http-exception";
import type { EmptyObject } from "type-fest";
import { formatZodErrors } from "~/utils";

type HonoInit<E extends Env> = ConstructorParameters<typeof Hono>[0] &
	OpenAPIHonoOptions<E>;

export const createApp = <
	E extends Env = Env,
	// biome-ignore lint/complexity/noBannedTypes: library default
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
