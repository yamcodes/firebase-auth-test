import { draw } from "radashi";

export const getGreeting = (name: string) => `Hello, ${name}!`;

export const getSpecialGreeting = () => "Hello, special person!";

export const getRandomGreeting = (name: string) => {
	const greetingsList = ["Hello", "How are you doing", "What's up", "Ma kore"];
	const randomGreeting = draw(greetingsList);
	return `${randomGreeting}, ${name}!`;
};
