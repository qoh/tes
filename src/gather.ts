import { join } from "https://deno.land/std@0.42.0/path/mod.ts";
import { TestModule, TestFunction } from "./interfaces.ts";
import { isLocalDirectory } from "./misc.ts";

export async function* getTests(path: string): AsyncIterableIterator<TestModule> {
	if (await isLocalDirectory(path)) {
		yield* getTestsFromLocalDirectory(path);
	} else {
		const testModule = await getTestsFromModule(path);

		if (testModule !== undefined) {
			yield testModule;
		}
	}
}

async function* getTestsFromLocalDirectory(path: string): AsyncIterableIterator<TestModule> {
	for await (const entry of Deno.readDir(path)) {
		const subpath = join(path, entry.name);
		if (await isLocalDirectory(subpath)) {
			yield* getTestsFromLocalDirectory(subpath);
		} else if (subpath.endsWith(".ts") || subpath.endsWith(".js")) {
			yield* getTests(subpath);
		}
	}
}

async function getTestsFromModule(
	path: string,
): Promise<TestModule | undefined> {
	const module = await import(path);

	if (typeof module === "object") {
		return {
			path: path,
			functions: Array.from(
				getTestsFromObject(module, [])),
		};
	}
}

function* getTestsFromObject(
	object: Object,
	propertyPath: string[],
): IterableIterator<TestFunction> {
	for (const [key, value] of Object.entries(object)) {
		if (typeof value === "function") {
			yield {
				propertyPath: propertyPath.concat(key),
				fn: value,
			};
		} else if (typeof value === "object") {
			yield* getTestsFromObject(value,
				propertyPath.concat(key));
		}
	}
}
