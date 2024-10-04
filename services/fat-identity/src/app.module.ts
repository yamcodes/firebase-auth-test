import { Module } from "@nestjs/common";
import { TRPCModule } from "nestjs-trpc";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DogsRouter } from "./dogs/dogs.router";
import { DatabaseService } from "./database.service";

@Module({
	imports: [TRPCModule.forRoot({ autoSchemaFile: "./src/@generated" })],
	controllers: [AppController],
	providers: [AppService, DatabaseService, DogsRouter],
})
export class AppModule {}
