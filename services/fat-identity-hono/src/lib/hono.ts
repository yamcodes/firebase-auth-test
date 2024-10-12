import { OpenAPIHono } from "@hono/zod-openapi";
import { formatZodErrors } from "~/utils";

export const defaultHook: OpenAPIHono["defaultHook"] = (result, { json }) => {
	if (result.success) return;

	return json(
		{
			ok: false,
			errors: formatZodErrors(result),
			source: "custom_error_handler",
		},
		422,
	);
};

export const createApp = (
	init?: ConstructorParameters<typeof OpenAPIHono>[0],
) => {
	return new OpenAPIHono({ defaultHook, ...init });
};
