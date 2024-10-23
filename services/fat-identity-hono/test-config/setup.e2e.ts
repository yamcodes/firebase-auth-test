import { afterEach, beforeEach } from "vitest";
import { logger } from "~/utils";

/**
 * Clear the database using the Firestore emulator REST endpoint
 * See: https://firebase.google.com/docs/emulator-suite/connect_firestore#clear_your_database_between_tests
 */
const clearDatabase = async () => {
	// biome-ignore lint/style/noNonNullAssertion: We perform validation on the environment variables
	const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG!);
	// biome-ignore lint/style/noNonNullAssertion: We perform validation on the environment variables
	const baseUrl = `http://${process.env.FIRESTORE_EMULATOR_HOST!}`;

	try {
		const response = await fetch(
			`${baseUrl}/emulator/v1/projects/${projectId}/databases/(default)/documents`,
			{ method: "DELETE" },
		);
		if (!response.ok) {
			throw new Error(`Failed to clear database: ${response.statusText}`);
		}
		logger.info("Database cleared successfully");
	} catch (error) {
		logger.error("Error clearing database:", error);
		throw error;
	}
};

beforeEach(async () => {
	await clearDatabase();
});

afterEach(async () => {
	await clearDatabase();
});
