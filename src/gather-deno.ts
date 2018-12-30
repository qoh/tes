import { readDir } from "deno";
import { getTestsFromModule } from "./gather.ts";
import { TestModule } from "./interfaces.ts";
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

async function* getTestsFromLocalDirectory(path: string) {
	for (const subpath of await readDirectory(path)) {
		if (await isLocalDirectory(subpath)) {
			yield* getTestsFromLocalDirectory(subpath);
		} else if (subpath.endsWith(".ts") || subpath.endsWith(".js")) {
			yield* getTests(subpath);
		}
	}
}

async function readDirectory(path: string): Promise<string[]> {
	return (await readDir(path)).map(info => info.path);
}
