import crypto from "node:crypto";
import { createMiddleware } from "hono/factory";
import { logger as customPinoLogger } from "~/utils";
import { STATUS_CODES } from "node:http";

interface LoggerOptions {
	/**
	 * Whether to log incoming requests and their responses
	 */
	logIncoming?: boolean | "verbose";
}

export const logger = ({
	logIncoming: logTraffic = true,
}: LoggerOptions = {}) =>
	createMiddleware(async (c, next) => {
		const start = Date.now();
		const requestId = crypto.randomUUID();

		c.set(
			"logger",
			customPinoLogger.child({
				requestId,
				path: c.req.path,
				method: c.req.method,
			}),
		);

		await next();

		const ms = Date.now() - start;
		const status = c.res.status;
		const statusText = STATUS_CODES[status] || "Unknown Status";

		// Log traffic (request and response) if enabled
		if (logTraffic) {
			customPinoLogger.info(
				{
					requestId,
					method: c.req.method,
					path: c.req.path,
					requestHeaders: logTraffic === "verbose" ? c.req.header() : undefined,
					responseHeaders: logTraffic === "verbose" ? c.res.headers : undefined,
				},
				`Response ${ms}ms ${status} ${statusText}`,
			);
		}

		// Log detailed error information if status code indicates an error
		if (status >= 400) {
			customPinoLogger.error({
				method: c.req.method,
				path: c.req.path,
				status,
				duration: `${ms}ms`,
				request: {
					headers: c.req.header(),
					body: await c.req.json(),
				},
				response: {
					headers: c.res.headers,
					body: c.res.body,
				},
			});
		}
	});
