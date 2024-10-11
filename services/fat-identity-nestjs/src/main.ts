import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);
	app.enableCors();
	app.enableVersioning({ type: VersioningType.URI });
	await app.listen(3030, "0.0.0.0");
}
bootstrap();
