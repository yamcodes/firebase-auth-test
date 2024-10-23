import { describe, expect, it } from "vitest";
import app from "~";

describe("General Routes", () => {
	it("should return health status", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(204);
		expect(res.body).toEqual(null);
	});

	it("should return version", async () => {
		const res = await app.request("/version");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toHaveProperty("version");
		expect(typeof json.version).toBe("string");
	});
});
