import { describe, expect, it } from "vitest";
import {
	getGreeting,
	getRandomGreeting,
	getSpecialGreeting,
} from "./greetings.service";

describe("Greetings Service", () => {
	describe("getGreeting", () => {
		it("should return a greeting with the given name", () => {
			const result = getGreeting("John");
			expect(result).toBeTypeOf("string");
			expect(result).toEqual("Hello, John!");
		});
	});

	describe("getSpecial", () => {
		it("should return a special greeting", () => {
			const result = getSpecialGreeting();
			expect(result).toBeTypeOf("string");
			expect(result).toEqual("Hello, special person!");
		});
	});

	describe("getRandomGreeting", () => {
		it("should return a random greeting with the given name", () => {
			const result = getRandomGreeting("Alice");
			expect(result).toBeTypeOf("string");
			expect(result).toContain("Alice");
		});

		it("should return different greetings for multiple calls", () => {
			const greetings = new Set();
			for (let i = 0; i < 10; i++) {
				const result = getRandomGreeting("TestUser");
				greetings.add(result);
			}
			// Expect at least 2 different greetings out of 10 calls
			expect(greetings.size).toBeGreaterThan(1);
		});
	});
});
