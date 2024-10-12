export class GreetingsService {
	getGreeting(name: string): string {
		return `Hello, ${name}!`;
	}

	getSpecialGreeting(): string {
		return "Hello, special person!";
	}
}
