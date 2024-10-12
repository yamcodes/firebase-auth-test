import pino from "pino";

export const logger = pino({
	level: import.meta.env.FAT_LOG_LEVEL || "info",
	transport: { target: "pino-pretty" },
});

export type Logger = typeof logger;
