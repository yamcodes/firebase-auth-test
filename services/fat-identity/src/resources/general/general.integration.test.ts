import { pino } from "pino";
import { describe, expect, it } from "vitest";
import { GeneralService } from "./general.service";

describe("General Service", () => {
	const logger = pino();
	const service = new GeneralService(logger);
	describe("getHealth", () => {
		it("should be healthy", () => {
			const isHealthy = service.getIsHealthy();
			expect(isHealthy).toBe(true);
		});
	});

	describe("getVersion", () => {
		it("should return a version string", () => {
			const result = service.getVersion();
			expect(result).toBeTypeOf("string");
			expect(result).toMatch(/^\d+\.\d+\.\d+$/); // Assuming semantic versioning
		});
	});
});
