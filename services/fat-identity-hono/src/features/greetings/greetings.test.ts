import { describe, expect, it } from "vitest";
import app from "~/index";

describe("Greetings Routes", () => {
	it("should return a greeting for a given name", async () => {
		const res = await app.request("/greetings/hello/John");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual({ message: "Hello, John!" });
	});

	it("should return a special greeting", async () => {
		const res = await app.request("/greetings/special");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual({ message: "Hello, special person!" });
	});

	it("should return a goodbye message", async () => {
		const res = await app.request("/greetings/goodbye");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toEqual({ message: "Goodbye!" });
	});

	it("should return a random greeting for a given name", async () => {
		const res = await app.request("/greetings/random/Alice");
		expect(res.status).toBe(200);
		const json = await res.json();
		expect(json).toHaveProperty("message");
		expect(typeof json.message).toBe("string");
		expect(json.message).toContain("Alice");
	});

	it("should return an error for short names in random greeting", async () => {
		const res = await app.request("/greetings/random/Al");
		expect(res.status).toBe(422);
		const json = await res.json();
		expect(json).toHaveProperty("errors");
		expect(json.errors[0].message).toContain("at least 3 characters");
	});
});
