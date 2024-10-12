import crypto from "node:crypto";
import { createMiddleware } from "hono/factory";
import { logger as customPinoLogger } from "~/utils";
import { STATUS_CODES } from "node:http";
import { match, P } from "ts-pattern";
import type { Level } from "pino";

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
		const logLevel = match<number, Level>(status)
			.with(P.number.gte(500), () => "error")
			.with(P.union(400, 401, 403, 404), () => "info") // Common client errors
			.with(P.number.gte(400), () => "warn") // Other 4xx errors
			.otherwise(() => "info");

		if (logTraffic) {
			customPinoLogger[logLevel](
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
	});
