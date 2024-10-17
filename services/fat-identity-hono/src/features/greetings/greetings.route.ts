import { db } from "~/config/firebase";
import { createApp } from "~/lib/hono";
import {
	getGreeting,
	getRandomGreeting,
	getSpecialGreeting,
} from "./greetings.service";
import { HTTPException } from "hono/http-exception";
import { GreetingConverter } from "./greetings.model";
import {
	getHelloRoute,
	getSpecialRoute,
	getGoodbyeRoute,
	getRandomGreetingRoute,
	postGreetingRoute,
	getGreetingRoute,
	getAllGreetingsRoute,
	deleteAllGreetingsRoute,
} from "./greetings.openapi";

export const greetings = createApp()
	.openapi(getHelloRoute, ({ req, var: { logger }, json }) => {
		const { name } = req.valid("param");
		logger.debug(`Processing greeting request for ${name}`);
		const message = getGreeting(name);
		return json({ message }, 200);
	})
	.openapi(getSpecialRoute, ({ var: { logger }, json }) => {
		logger.debug("Processing special greeting request");
		const message = getSpecialGreeting();
		return json({ message });
	})
	.openapi(getGoodbyeRoute, ({ json }) => {
		return json({ message: "Goodbye!" });
	})
	.openapi(getRandomGreetingRoute, ({ req, json }) => {
		const { name } = req.valid("param");
		const message = getRandomGreeting(name);
		return json({ message });
	})
	.openapi(postGreetingRoute, async ({ req, json, var: { logger } }) => {
		const greetingDto = req.valid("json");
		const { name, greeting: rawGreeting } = greetingDto;
		const greeting = rawGreeting.replace("%name", name);
		logger.debug({ greetingDto }, "Saving greeting");
		const docRef = await db
			.collection("greetings")
			.withConverter(GreetingConverter)
			.add({
				name,
				greeting,
			});
		const result = await docRef.get();
		const resultData = result.data();
		if (!resultData) {
			throw new HTTPException(500, {
				message: "Failed to save greeting",
			});
		}
		logger.debug({ resultData }, "Greeting saved successfully");
		return json({ ...resultData, id: docRef.id }, 201);
	})
	.openapi(getGreetingRoute, async ({ req, json }) => {
		const { id } = req.valid("param");
		const greeting = await db.collection("greetings").doc(id).get();
		if (greeting.exists) {
			return json(greeting.data());
		}
		throw new HTTPException(404, {
			message: "Greeting not found",
		});
	})
	.openapi(getAllGreetingsRoute, async ({ json, var: { logger } }) => {
		logger.debug("Retrieving all greetings");
		const greetingsSnapshot = await db
			.collection("greetings")
			.withConverter(GreetingConverter)
			.get();
		const greetings = greetingsSnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		logger.debug(
			{ greetingsCount: greetings.length },
			"Greetings retrieved successfully",
		);
		return json(greetings, 200);
	})
	.openapi(deleteAllGreetingsRoute, async ({ var: { logger }, body }) => {
		logger.debug("Deleting all greetings");
		const greetingsSnapshot = await db
			.collection("greetings")
			.withConverter(GreetingConverter)
			.get();
		const batch = db.batch();
		for (const doc of greetingsSnapshot.docs) {
			batch.delete(doc.ref);
		}
		await batch.commit();
		const deletedCount = greetingsSnapshot.size;
		logger.debug({ deletedCount }, "All greetings deleted successfully");
		return body(null, 204);
	});
