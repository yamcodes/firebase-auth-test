import crypto from "node:crypto";
import { createMiddleware } from "hono/factory";
import { logger as customPinoLogger } from "~/utils";

interface LoggerOptions {
	/**
	 * Whether to automatically log requests
	 */
	logRequests?: boolean;
	/**
	 * Whether to automatically log responses
	 */
	logResponses?: boolean;
}

export const logger = ({
	logRequests = true,
	logResponses = true,
}: LoggerOptions = {}) =>
	createMiddleware(async (c, next) => {
		const requestId = crypto.randomUUID();
		const requestLogger = customPinoLogger.child({
			requestId,
			path: c.req.path,
			method: c.req.method,
		});

		c.set("logger", requestLogger);

		if (logRequests) {
			requestLogger.info("Request started", {
				headers: c.req.header(),
				query: c.req.query(),
			});
		}

		await next();

		if (logResponses) {
			requestLogger.info("Request completed", {
				status: c.res.status,
				headers: c.res.headers,
			});
		}
	});
