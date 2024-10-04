import { faker } from "@faker-js/faker";
import type { FastifyPluginCallback } from "fastify";

export const routes: FastifyPluginCallback = (fastify, _options, done) => {
	fastify.get("/legacy", () => ({
		hello: "world!",
		randomName: faker.person.firstName(),
		nice: 69,
	}));

	done();
};
