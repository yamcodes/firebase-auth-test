import type { BaseLogger } from "pino";
import { version } from "~/../package.json";

export class GeneralService {
	constructor(private readonly logger: BaseLogger) {}
	getHealthStatus() {
		return "OK";
	}

	getVersion() {
		return version;
	}
}
