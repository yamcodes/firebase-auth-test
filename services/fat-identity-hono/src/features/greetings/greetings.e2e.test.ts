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

	it("should return a random greeting for a given name", async () => {
		const response = await app.request("/greetings/random/Alice");
		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body).toHaveProperty("message");
		expect(typeof body.message).toBe("string");
		expect(body.message).toContain("Alice");
	});

	it("should delete a greeting by ID", async () => {
		// before we delete, we should have 3 greetings
		const response = await app.request("/greetings");
		expect(response.status).toBe(200);
		const greetings = await response.json();
		expect(greetings.length).toBe(seedGreetings.length);

		const deleteResponse = await app.request("/greetings/1", {
			method: "DELETE",
		});
		expect(deleteResponse.status).toBe(204);

		// after we delete, we should have 2 greetings
		const getResponse = await app.request("/greetings");
		expect(getResponse.status).toBe(200);
		const greetingsAfter = await getResponse.json();
		expect(greetingsAfter.length).toBe(seedGreetings.length - 1);

		// deleting the same greeting again should return 404
		const deleteResponse2 = await app.request("/greetings/1", {
			method: "DELETE",
		});
		expect(deleteResponse2.status).toBe(404);
	});
});
