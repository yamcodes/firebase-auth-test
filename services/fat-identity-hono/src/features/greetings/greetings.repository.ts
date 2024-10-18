import type { DatabaseInterface } from "../database";
import { type Greeting, GreetingDto } from "./greetings.schema";

export class GreetingsRepository {
	constructor(private db: DatabaseInterface) {}

	async getAllGreetings(): Promise<Greeting[]> {
		return this.db.getAll("greetings", GreetingDto);
	}
}
