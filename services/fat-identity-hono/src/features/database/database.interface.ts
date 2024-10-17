export interface DatabaseInterface {
	add(collection: string, data: any): Promise<string>;
	get(collection: string, id: string): Promise<any | null>;
	// Add other methods as needed
}
