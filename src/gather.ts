import { TestModule, TestFunction } from "./interfaces";

export async function getTestsFromModule(
	path: string,
): Promise<TestModule | undefined> {
	const module = await import(path);

	if (typeof module === 'object') {
		return {
			path: path,
			functions: Array.from(
				getTestsFromObject(module, [])),
		};
	}
}

export function* getTestsFromObject(
	object, propertyPath,
): IterableIterator<TestFunction> {
	for (const [key, value] of Object.entries(object)) {
		if (typeof value === 'function') {
			yield {
				propertyPath: propertyPath.concat(key),
				fn: value,
			};
		} else if (typeof value === 'object') {
			yield* getTestsFromObject(value,
				propertyPath.concat(key));
		}
	}
}
