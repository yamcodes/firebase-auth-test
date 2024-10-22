import { HTTPException } from "hono/http-exception";
import pino from "pino";
import { describe, expect, it } from "vitest";
import { InMemoryDatabase } from "~/database/adapters/in-memory/in-memory.database";
import { GreetingsRepository } from "./greetings.repository";
import { GreetingsService } from "./greetings.service";

describe("Greetings Service + Repository Integration Tests", () => {
	const db = new InMemoryDatabase();
	const repo = new GreetingsRepository(db);
	const logger = pino();
	const greetingsService = new GreetingsService(repo, logger);

	describe("getGreeting", () => {
		it("should return a greeting with the given name", () => {
			const result = greetingsService.getGreeting("John");
			expect(result).toBe("Hello, John!");
		});
	});

	describe("getSpecialGreeting", () => {
		it("should return a special greeting", () => {
			const result = greetingsService.getSpecialGreeting();
			expect(result).toBe("Here's a special greeting just for you!");
		});
	});

	describe("getGoodbye", () => {
		it("should return a goodbye message", () => {
			const result = greetingsService.getGoodbye();
			expect(result).toBe("Goodbye!");
		});
	});

	describe("getRandomGreeting", () => {
		it("should return a random greeting with the given name", () => {
			const result = greetingsService.getRandomGreeting("Alice");
			expect(result).toContain("Alice");
			expect([
				"Hello, Alice!",
				"Hi there, Alice!",
				"Greetings, Alice!",
				"Welcome, Alice!",
			]).toContain(result);
		});

		it("should return different greetings for multiple calls", () => {
			const greetings = new Set();
			for (let i = 0; i < 20; i++) {
				const result = greetingsService.getRandomGreeting("TestUser");
				greetings.add(result);
			}
			// Expect at least 2 different greetings out of 20 calls
			expect(greetings.size).toBeGreaterThan(1);
		});
	});

	describe("deleteOne", () => {
		it("should delete a greeting and return the deleted count", async () => {
			const createdGreeting = await repo.create({
				name: "Test greeting",
				greeting: "Test greeting",
			});

			const result = await greetingsService.deleteOne(createdGreeting.id);

			expect(result).toBe(1);
			const deletedGreeting = await repo.findOne(createdGreeting.id);
			expect(deletedGreeting).toBeNull();
		});

		it("should handle the case when no greeting is deleted", async () => {
			const nonExistentId = "456";

			const result = await greetingsService.deleteOne(nonExistentId);

			expect(result).toBe(0);
		});
	});
});
