import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { formatZodErrors } from "~/utils";

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
