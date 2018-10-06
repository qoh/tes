import { args, exit } from "deno";
import { getTests } from "./gather-deno";
import { collectAsync } from "https://cdn.rawgit.com/qoh/utility/v0.0.1/src/iterable.ts";
import { runTests } from "./run";
import { displayResults } from "./display";

export async function main() {
	const { entryPath } = parseArgs();

	console.log("Finding tests");
	const tests = await collectAsync(getTests(entryPath));
	console.log(`Found ${tests.length} tests, running`);
	const results = await runTests(tests);
	console.log();

	const { failureCount } = displayResults(results);

	if (failureCount > 0) {
		exit(1);
	}
}

function parseArgs() {
	if (args.length !== 2) {
		console.log(`Usage: deno ${args[0]} <entry>`);
		exit(1);
	}

	const entryPath = args[1];

	// TODO: If entryPath is local and not absolute, it will be relative to
	// the directory of `gather.ts`, rather than the current working directory.

	return {
		entryPath,
	};
}
