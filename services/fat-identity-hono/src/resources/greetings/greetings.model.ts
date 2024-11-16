import type { Greeting, GreetingDto } from "./greetings.schema";

export const GreetingConverter = {
	toFirestore: (greeting: GreetingDto) => greeting,
	fromFirestore: (
		snapshot: FirebaseFirestore.QueryDocumentSnapshot,
	): Greeting => ({
		id: snapshot.id,
		...(snapshot.data() as GreetingDto),
	}),
};
