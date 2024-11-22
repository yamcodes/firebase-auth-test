import Fastify from "fastify";
import appService from "./app";

// Instantiate Fastify with some config
const app = Fastify({
	logger: true,
});

app.register(appService);

// Start listening.
app.listen({ port: Number(process.env.PORT) || 1434 }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
