import type { GreetingsRepository } from "./greetings.repository";
import type { Greeting, GreetingDto } from "./greetings.schema";
import type { Logger } from "~/utils";
import { HTTPException } from "hono/http-exception";

export class GreetingsService {
	constructor(
		private readonly greetingsRepository: GreetingsRepository,
		private readonly logger: Logger,
	) {}

	getSpecialGreeting(): string {
		return "Here's a special greeting just for you!";
	}

	getGoodbye(): string {
		return "Goodbye!";
	}

	getRandomGreeting(name: string): string {
		const greetings = [
			`Hello, ${name}!`,
			`Hi there, ${name}!`,
			`Greetings, ${name}!`,
			`Welcome, ${name}!`,
		];
		return greetings[Math.floor(Math.random() * greetings.length)];
	}

	getGreeting(name: string): string {
		return `Hello, ${name}!`;
	}

	async createGreeting(greetingDto: GreetingDto): Promise<Greeting> {
		const { name, greeting: rawGreeting } = greetingDto;
		const greeting = rawGreeting.replace("%name", name);
		this.logger.debug({ greetingDto }, "Saving greeting");
		try {
			const result = await this.greetingsRepository.createGreeting({
				name,
				greeting,
			});
			this.logger.debug({ result }, "Greeting saved successfully");
			return result;
		} catch (error) {
			this.logger.error({ error }, "Failed to save greeting");
			throw new HTTPException(500, { message: "Failed to save greeting" });
		}
	}

	async getAllGreetings(): Promise<Greeting[]> {
		this.logger.debug("Retrieving all greetings");
		const greetings = await this.greetingsRepository.getAllGreetings();
		this.logger.debug(
			{ greetingsCount: greetings.length },
			"Greetings retrieved successfully",
		);
		return greetings;
	}

	async getGreetingById(id: string): Promise<Greeting> {
		this.logger.debug({ id }, "Retrieving greeting by ID");
		const greeting = await this.greetingsRepository.getGreetingById(id);
		if (!greeting) {
			this.logger.debug({ id }, "Greeting not found");
			throw new HTTPException(404, { message: "Greeting not found" });
		}
		this.logger.debug({ greeting }, "Greeting retrieved successfully");
		return greeting;
	}

	async deleteAllGreetings(): Promise<number> {
		this.logger.debug("Deleting all greetings");
		const deletedCount = await this.greetingsRepository.deleteAllGreetings();
		this.logger.debug({ deletedCount }, "All greetings deleted successfully");
		return deletedCount;
	}
}
