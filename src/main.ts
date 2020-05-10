import { join, resolve } from "https://deno.land/std@0.42.0/path/mod.ts";
import { getTests } from "./gather.ts";
import { collectAsync } from "https://cdn.rawgit.com/qoh/utility/v0.0.1/src/iterable.ts";
import { runTestModules } from "./run.ts";
import { TerminalDisplayResultAggregator } from "./display.ts";
import { ErrorDetectAggregator, MultipleAggregator, SerialAggregator } from "./aggregator.ts";
import { isLocalDirectory } from "./misc.ts";

export async function main() {
	const { entryPath } = await parseArgs();

	console.log("Running tests from", entryPath);

	const testModules = await collectAsync(getTests(entryPath));
	const testCount = testModules
		.map(module => module.functions.length)
		.reduce((a, b) => a + b, 0);

	if (testCount === 0) {
		console.log("Found no tests");
		return;
	}

	console.log(`Found ${testCount} tests, running`);

	const errorAggregator = new ErrorDetectAggregator;

	const aggregator = new MultipleAggregator([
		new SerialAggregator(new TerminalDisplayResultAggregator),
		errorAggregator,
	]);

	await runTestModules(aggregator, testModules);

	if (errorAggregator.hasFailure()) {
		Deno.exit(1);
	}
}

async function parseArgs() {
	let entryPath = null;

	for (let i = 1; i < Deno.args.length; i++) {
		const arg = Deno.args[i];

		if (entryPath !== null) {
			return usageAndExit();
		}

		entryPath = arg;
	}

	// If no entry was passed, look for a "test" folder.
	if (entryPath === null) {
		entryPath = join(Deno.cwd(), "/test");

		if (!await isLocalDirectory(entryPath)) {
			console.log("Error: No entry passed, and no test folder exists");
			return usageAndExit();
		}
	} else {
		entryPath = resolveEntryPath(Deno.cwd(), entryPath);
	}

	// TODO: If entryPath is local and not absolute, it will be relative to
	// the directory of `gather.ts`, rather than the current working directory.

	return { entryPath };
}

function resolveEntryPath(cwd: string, entryPath: string): string {
	if (entryPath.match(/https?:\/\//)) {
		return entryPath;
	} else {
		return resolve(cwd, entryPath);
	}
}

function usageAndExit() {
	console.log(`Usage: deno ${Deno.args[0]} [entry]`);
	return Deno.exit(1);
}

if (import.meta.main) {
	main();
}
