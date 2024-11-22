import type { BaseLogger } from "pino";
import { version } from "~/../package.json";

export class GeneralService {
	constructor(private readonly logger: BaseLogger) {}

	getIsHealthy() {
		return true;
	}

	getVersion() {
		return version;
	}
}
