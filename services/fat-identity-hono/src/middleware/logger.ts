import crypto from "node:crypto";
import { createMiddleware } from "hono/factory";
import { logger as customPinoLogger } from "~/utils";

export const logger = createMiddleware(async (c, next) => {
	const requestId = crypto.randomUUID();
	const logger = customPinoLogger.child({
		requestId,
		path: c.req.path,
		method: c.req.method,
	});

	c.set("logger", logger);

	// Log the start of the request
	logger.info("Request started");

	await next();

	// Log the end of the request
	logger.info("Request completed");
});
