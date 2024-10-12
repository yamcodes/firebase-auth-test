import { version } from "../../../package.json";

export class GeneralService {
	getHealthStatus(): string {
		return "OK";
	}

	getVersion(): string {
		return version;
	}
}
