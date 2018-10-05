import { Test } from "./interfaces";

export async function* getTests(
	sourceModulePath: string,
): AsyncIterableIterator<Test> {
	const module = await import(sourceModulePath);

	if (typeof module === 'object') {
		yield* getTestsFromObject(module, sourceModulePath, []);
	}
}

export function* getTestsFromObject(
	object, sourceModulePath, identifierChain,
): IterableIterator<Test> {
	for (const [key, value] of Object.entries(object)) {
		if (typeof value === 'function') {
			yield {
				sourceModulePath,
				identifierChain: identifierChain.concat(key),
				function: value,
			};
		} else if (typeof value === 'object') {
			yield* getTestsFromObject(value, sourceModulePath,
				identifierChain.concat(key));
		}
	}
}
