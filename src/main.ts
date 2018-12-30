#!/usr/bin/env deno

import { args, exit, cwd } from "deno";
import { getTests } from "./gather-deno.ts";
import { collectAsync } from "https://cdn.rawgit.com/qoh/utility/v0.0.1/src/iterable.ts";
import { runTestModules } from "./run.ts";
import { displayResults } from "./display.ts";
import { isLocalDirectory } from "./misc.ts";

export async function main() {
	const { entryPath } = await parseArgs();

	console.log("Finding tests");

	const testModules = await collectAsync(getTests(entryPath));
	const testCount = testModules
		.map(module => module.functions.length)
		.reduce((a, b) => a + b, 0);

	if (testCount === 0) {
		console.log("Found no tests");
		return;
	}

	console.log(`Found ${testCount} tests, running`);
	const results = await runTestModules(testModules);
	console.log();

	const { successCount, failureCount } = displayResults(results);
	console.log(`${successCount}/${testCount} succeeded, ${failureCount} failed`);

	if (failureCount > 0) {
		exit(1);
	}
}

async function parseArgs() {
	let entryPath = null;

	for (let i = 1; i < args.length; i++) {
		const arg = args[i];

		if (entryPath !== null) {
			return usageAndExit();
		}

		entryPath = arg;
	}

	// If no entry was passed, look for a "test" folder.
	if (entryPath === null) {
		entryPath = cwd() + "/test";

		if (!await isLocalDirectory(entryPath)) {
			console.log("Error: No entry passed, and no test folder exists");
			return usageAndExit();
		}

		console.log(`Using test folder: ${entryPath}`);
	}

	// TODO: If entryPath is local and not absolute, it will be relative to
	// the directory of `gather.ts`, rather than the current working directory.

	return { entryPath };
}

function usageAndExit() {
	console.log(`Usage: deno ${args[0]} [entry]`);
	return exit(1);
}

main();
