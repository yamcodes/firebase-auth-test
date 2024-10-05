import z from "zod";
import { Dog } from "./entities/dog.entity";

export const CreateDogDto = Dog.omit({ id: true });
export type CreateDogDto = z.infer<typeof CreateDogDto>;
