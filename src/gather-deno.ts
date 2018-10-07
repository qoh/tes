import { stat, readDir, ErrorKind } from "deno";
import { getTestsFromModule } from "./gather";
import { TestModule } from "./interfaces";

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

async function* getTestsFromLocalDirectory(path: string) {
	for (const subpath of await readDirectory(path)) {
		if (await isLocalDirectory(subpath)) {
			yield* getTestsFromLocalDirectory(subpath);
		} else if (subpath.endsWith(".ts") && subpath.endsWith(".js")) {
			yield* getTests(subpath);
		}
	}
}

async function readDirectory(path: string): Promise<string[]> {
	return (await readDir(path)).map(info => info.path);
}

async function isLocalDirectory(path: string): Promise<boolean> {
	// TODO: Check that it is local first.

	try {
		return (await stat(path)).isDirectory();
	} catch (error) {
		if (error.kind === ErrorKind.NotFound) {
			return false;
		}

		throw error;
	}
}
