import { TestResult } from "./run";
import { prefixLines } from "https://cdn.rawgit.com/qoh/utility/v0.0.1/src/string.ts";
import { AssertEqualsError } from "https://cdn.rawgit.com/qoh/assert/v0.0.1/src/index.ts";

export interface Stats {
	successCount: number,
	failureCount: number,
}

/**
 * @returns Number of tests that failed.
 */
export function displayResults(results: TestResult[]): Stats {
	let successCount = 0;
	let failureCount = 0;

	let lastFailed = false;

	for (const result of results) {
		const { test: { sourceModulePath, identifierChain }, milliseconds } = result;
		const identifier = identifierChain.join(".");

		if (result.outcome === "failure") {
			// ✗
			// ❌

			if (!lastFailed) {
				console.error();
			}

			console.error(` ❌  ${identifier} in ${sourceModulePath} [${milliseconds}ms]`);
			console.error(prefixLines("    ", getErrorString(result.error)));
			console.error();

			failureCount++;
		} else {
			// ✅
			// ✓
			console.log(` ✅  ${identifier} in ${sourceModulePath} [${milliseconds}ms]`);
			successCount++;
		}

		lastFailed = result.outcome === "failure";
	}

	if (!lastFailed) {
		console.log();
	}

	console.log(`${successCount}/${results.length} succeeded, ${failureCount} failed`);

	return { successCount, failureCount };
}

function getErrorString(error: any): string {
	if (error instanceof AssertEqualsError) {
		// TODO: Inspect these values in a nice way
		const actual = JSON.stringify(error.actual);
		const expected = JSON.stringify(error.expected);
		return `Actual:   ${actual}\nExpected: ${expected}\n${error.stack}`;
	}

	if (error instanceof Error) {
		return error.stack;
	}

	// TODO: Inspect this value in a nice way
	return `Thrown value: ${JSON.stringify(error)}`;
}
