import { args, exit } from "deno";
import { getTests } from "./gather-deno";
import { collectAsync } from "https://cdn.rawgit.com/qoh/utility/v0.0.1/src/iterable.ts";
import { runTestModules } from "./run";
import { displayResults } from "./display";

async function main() {
	const { entryPath } = parseArgs();

	console.log("Finding tests");
	const testModules = await collectAsync(getTests(entryPath));
	const testCount = testModules
		.map(module => module.functions.length)
		.reduce((a, b) => a + b, 0);
	console.log(`Found ${testCount} tests, running`);
	const results = await runTestModules(testModules);
	console.log();

	const { successCount, failureCount } = displayResults(results);
	console.log(`${successCount}/${testCount} succeeded, ${failureCount} failed`);

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

	return { entryPath };
}

main();
