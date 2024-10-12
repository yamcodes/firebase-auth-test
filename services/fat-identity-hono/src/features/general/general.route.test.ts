import { describe, expect, it } from "vitest";
import app from "~/index";

describe("General Routes", () => {
	it("should return health status", async () => {
		const res = await app.request("/health");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual({ status: "OK" });
	});

	it("should return version", async () => {
		const res = await app.request("/version");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toHaveProperty("version");
		expect(typeof json.version).toBe("string");
	});
});
