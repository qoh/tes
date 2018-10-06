import { assert, assertEquals } from "https://cdn.rawgit.com/qoh/assert/v0.1.1/src/index.ts";

export function throws(test: () => any, constructor?: Function, message?: string): () => any {
	return () => {
		try {
			test();
		} catch (error) {
			if (constructor !== undefined) {
				assertEquals(typeof error, "object", "Expected test to throw an object");
				assertEquals(Object.getPrototypeOf(error).constructor, constructor, `Expected test to throw instance of constructor`);

				if (message !== undefined) {
					assertEquals(error.message, message, "Expected test to throw instance with message");
				}
			}

			return;
		}

		throw new Error("Expected test to throw");
	};
}
