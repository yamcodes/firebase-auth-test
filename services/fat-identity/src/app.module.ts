import { Module } from "@nestjs/common";
import { TRPCModule } from "nestjs-trpc";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseService } from "./database.service";
import { DogsRouter } from "./dogs/dogs.router";

@Module({
	imports: [TRPCModule.forRoot({ autoSchemaFile: "./src/@generated" })],
	controllers: [AppController],
	providers: [AppService, DatabaseService, DogsRouter],
})
export class AppModule {}
