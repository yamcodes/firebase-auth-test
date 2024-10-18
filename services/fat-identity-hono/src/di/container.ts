import { FirestoreDatabase } from "~/database";
import { GreetingsRepository } from "~/features/greetings/greetings.repository";

export class Container {
	private static instance: Container;
	private greetingsRepository: GreetingsRepository;

	private constructor() {
		const db = new FirestoreDatabase();
		this.greetingsRepository = new GreetingsRepository(db);
	}

	static getInstance(): Container {
		if (!Container.instance) {
			Container.instance = new Container();
		}
		return Container.instance;
	}

	getGreetingsRepository(): GreetingsRepository {
		return this.greetingsRepository;
	}
}
