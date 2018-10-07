import { assertEquals } from "https://cdn.rawgit.com/qoh/assert/v0.1.1/src/index.ts";

export function throws(test: Function): () => Promise<void>;
export function throws(constructor: Function, test: Function): () => Promise<void>;
export function throws(message: string, test: Function): () => Promise<any>;
export function throws(constructor: Function, message: string, test: Function): () => Promise<any>;
export function throws(a: Function | string, b?: Function | string, c?: Function): () => Promise<any> {
	let constructor: Function | undefined;
	let message: string | undefined;
	let test: Function;

	// TODO: Consider stricter runtime type-checking here
	if (c !== undefined) {
		constructor = a as Function;
		message = b as string;
		test = c;
	} else if (b !== undefined) {
		if (typeof a === "string") {
			message = a;
		} else {
			constructor = a;
		}

		test = b as Function;
	} else {
		test = a as Function;
	}

	return async () => {
		try {
			await test();
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
