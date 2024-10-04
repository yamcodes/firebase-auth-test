import { Injectable } from "@nestjs/common";
import z from "zod";
import { Dog } from "./dogs/entities/dog.entity";
import { CreateDogDto } from "./dogs/dogs.dto";

@Injectable()
export class DatabaseService {
	private dogs: Dog[] = [
		{ name: "Buddy", breed: "Labrador", id: "buddy-1" },
		{ name: "Max", breed: "Corgi", id: "max-1" },
		{ name: "Charlie", breed: "Beagle", id: "charlie-1" },
	];

	getDogs(): Dog[] {
		return this.dogs;
	}

	addDog(dog: CreateDogDto): Dog {
		const res = { ...dog, id: crypto.randomUUID() };
		this.dogs.push(res);
		return res;
	}
}
