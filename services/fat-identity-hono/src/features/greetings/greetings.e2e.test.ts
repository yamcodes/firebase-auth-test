import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import app from "~";
import { db } from "~/config/firebase";
import { logger } from "~/utils";
import type { Greeting, GreetingDto } from "./greetings.schema";

describe("Greetings E2E Tests", () => {
	const seedGreetings: Greeting[] = [
		{ name: "Alice", greeting: "Hi there, Alice!", id: "1" },
		{ name: "Bob", greeting: "Hello, Bob!", id: "2" },
		{ name: "Charlie", greeting: "Greetings, Charlie!", id: "3" },
	];

	const additionalGreetings: GreetingDto[] = [
		{ name: "Dave", greeting: "Hello, Dave!" },
		{ name: "Eve", greeting: "Hi, Eve!" },
	];

	const seedDatabase = async () => {
		logger.info("Seeding");
		const batch = db.batch();
		for (const greeting of seedGreetings) {
			const docRef = db.collection("greetings").doc(greeting.id);
			batch.set(docRef, { name: greeting.name, greeting: greeting.greeting });
		}
		await batch.commit();
	};

	beforeEach(async () => {
		await seedDatabase();
	});

	it("should start with seeded greetings", async () => {
		const response = await app.request("/greetings");
		expect(response.status).toBe(200);
		const greetings = await response.json();
		expect(Array.isArray(greetings)).toBe(true);
		expect(greetings.length).toBe(seedGreetings.length);
	});

	it("should create multiple greetings", async () => {
		for (const greeting of additionalGreetings) {
			const response = await app.request("/greetings", {
				method: "POST",
				body: JSON.stringify(greeting),
				headers: new Headers({ "Content-Type": "application/json" }),
			});
			expect(response.status).toBe(201);
			const body = await response.json();
			expect(body).toMatchObject(greeting);
			expect(body).toHaveProperty("id");
		}
	});

	it("should retrieve all created greetings", async () => {
		const response = await app.request("/greetings");
		expect(response.status).toBe(200);
		const greetings = await response.json();
		expect(Array.isArray(greetings)).toBe(true);
		expect(greetings.length).toBe(seedGreetings.length);

		for (const testGreeting of seedGreetings) {
			const foundGreeting = greetings.find(
				(g: Greeting) => g.name === testGreeting.name,
			);
			expect(foundGreeting).toBeDefined();
			expect(foundGreeting?.greeting).toBe(testGreeting.greeting);
		}
	});

	it("should return a hello message for existing name", async () => {
		const response = await app.request("/greetings/hello/Alice");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ message: "Hello, Alice!" });
	});

	it("should return a default hello message for non-existing name", async () => {
		const response = await app.request("/greetings/hello/David");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ message: "Hello, David!" });
	});

	it("should delete all greetings", async () => {
		const deleteResponse = await app.request("/greetings/all", {
			method: "DELETE",
		});
		expect(deleteResponse.status).toBe(204);

		const getResponse = await app.request("/greetings");
		expect(getResponse.status).toBe(200);
		const greetings = await getResponse.json();
		expect(Array.isArray(greetings)).toBe(true);
		expect(greetings.length).toBe(0);
	});

	it("should return a goodbye message", async () => {
		const response = await app.request("/greetings/goodbye");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ message: "Goodbye!" });
	});

	it("should return a random greeting for a given name", async () => {
		const response = await app.request("/greetings/random/Alice");
		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body).toHaveProperty("message");
		expect(typeof body.message).toBe("string");
		expect(body.message).toContain("Alice");
	});
});
