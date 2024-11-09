import { HTTPException } from "hono/http-exception";
import type { BaseLogger } from "pino";
import type { Logger } from "~/utils";
import type { GreetingsRepository } from "./greetings.repository";
import type { Greeting, GreetingDto } from "./greetings.schema";

export class GreetingsService {
	constructor(
		private readonly greetingsRepository: GreetingsRepository,
		private readonly logger: BaseLogger,
	) {}

	getSpecialGreeting(): string {
		return "This is a special greeting just for you!";
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

	async createGreeting(greetingDto: GreetingDto): Promise<Greeting> {
		const { name, greeting: rawGreeting } = greetingDto;
		const greeting = rawGreeting.replace("%name", name);
		this.logger.debug({ greetingDto }, "Saving greeting");
		try {
			const result = await this.greetingsRepository.create({
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
		const greetings = await this.greetingsRepository.findAll();
		this.logger.debug(
			{ greetingsCount: greetings.length },
			"Greetings retrieved successfully",
		);
		return greetings;
	}

	async getGreetingById(id: string): Promise<Greeting> {
		this.logger.debug({ id }, "Retrieving greeting by ID");
		const greeting = await this.greetingsRepository.findOne(id);
		if (!greeting) {
			this.logger.debug({ id }, "Greeting not found");
			throw new HTTPException(404, { message: "Greeting not found" });
		}
		this.logger.debug({ greeting }, "Greeting retrieved successfully");
		return greeting;
	}

	async deleteAllGreetings(): Promise<number> {
		this.logger.debug("Deleting all greetings");
		const deletedCount = await this.greetingsRepository.deleteAll();
		this.logger.debug({ deletedCount }, "All greetings deleted successfully");
		return deletedCount;
	}

	async deleteOne(id: string): Promise<number> {
		this.logger.debug({ id }, "Deleting greeting by ID");
		const deletedCount = await this.greetingsRepository.deleteOne(id);
		this.logger.debug({ deletedCount }, "Greeting deleted successfully");
		return deletedCount;
	}
}
