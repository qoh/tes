import { assert, assertEquals } from "https://cdn.rawgit.com/qoh/assert/v0.1.1/src/index.ts";

type Test = () => any;

export function throws(test: Test): Test;
export function throws(constructor: Function, test: Test): Test;
export function throws(message: string, test: Test): Test;
export function throws(constructor: Function, message: string, test: Test): Test;
export function throws(a: Test | Function | string, b?: Test | string, c?: Test): () => any {
	let constructor: Function | undefined;
	let message: string | undefined;
	let test: Test;

	// TODO: Consider stricter runtime type-checking here
	if (c !== undefined) {
		constructor = a as Function;
		message = b as string;
		test = c;
	} else if (b !== undefined) {
		if (typeof a === "string") {
			message = a as string;
		} else {
			constructor = a as Function;
		}

		test = b as Test;
	} else {
		test = a as Test;
	}

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
