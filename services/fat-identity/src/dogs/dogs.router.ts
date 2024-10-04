import { Inject } from "@nestjs/common";
import { Input, Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";
import { DatabaseService } from "../database.service";
import { CreateDogDto } from "./dogs.dto";
import { Dog } from "./entities/dog.entity";

@Router({ alias: "dogs" })
export class DogsRouter {
	constructor(
		@Inject(DatabaseService) private databaseService: DatabaseService,
	) {}

	@Query({ output: z.array(Dog) })
	async findAll(): Promise<Dog[]> {
		const dogs = this.databaseService.getDogs();
		return dogs;
	}

	@Mutation({ input: CreateDogDto, output: Dog })
	async create(@Input() createDogDto: CreateDogDto): Promise<Dog> {
		const dog = this.databaseService.addDog(createDogDto);
		return dog;
	}
}
