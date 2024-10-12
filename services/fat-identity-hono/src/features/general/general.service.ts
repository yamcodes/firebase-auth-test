import { logger } from "~/utils";
import { version } from "../../../package.json";

export const getHealthStatus = () => "OK";

export const getVersion = () => {
	logger.debug("Version", { version });
	throw new Error("Not implemented");
};
