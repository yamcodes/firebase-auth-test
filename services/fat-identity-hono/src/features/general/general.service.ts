import { version } from "~/../package.json";
import { logger } from "~/utils";

export const getHealthStatus = () => "OK";

export const getVersion = () => {
	logger.debug("Version", { version });
	return version;
};
