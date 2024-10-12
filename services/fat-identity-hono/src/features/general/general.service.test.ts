import { describe, expect, it } from "vitest";
import { getHealthStatus, getVersion } from "./general.service";

describe("General Service", () => {
	describe("getHealth", () => {
		it("should return OK status", () => {
			const result = getHealthStatus();
			expect(result).toBeTypeOf("string");
			expect(result).toEqual("OK");
		});
	});

	describe("getVersion", () => {
		it("should return a version string", () => {
			const result = getVersion();
			expect(result).toBeTypeOf("string");
			expect(result).toMatch(/^\d+\.\d+\.\d+$/); // Assuming semantic versioning
		});
	});
});
