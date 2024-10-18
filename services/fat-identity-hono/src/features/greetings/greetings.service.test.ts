import { describe, expect, it, vi } from "vitest";
import { GreetingsService } from "./greetings.service";
import { GreetingsRepository } from "./greetings.repository";
import type { BaseLogger } from "pino";
import { FirestoreDatabase } from "~/database";

describe("GreetingsService", () => {
	const mockLogger: BaseLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		level: "debug",
		fatal: vi.fn(),
		trace: vi.fn(),
		silent: vi.fn(),
	};

	const mockDb = vi.mocked(new FirestoreDatabase());
	const mockRepository = vi.mocked(new GreetingsRepository(mockDb));
	const greetingsService = new GreetingsService(mockRepository, mockLogger);

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
});
