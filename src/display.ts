import { TestModuleResult } from "./run.ts";
import { prefixLines } from "https://cdn.rawgit.com/qoh/utility/v0.0.1/src/string.ts";

export interface Stats {
	successCount: number,
	failureCount: number,
}

export function displayResults(results: TestModuleResult[]): Stats {
	let successCount = 0;
	let failureCount = 0;

	for (const result of results) {
		const innerStats = displayModuleResults(result);
		successCount += innerStats.successCount;
		failureCount += innerStats.failureCount;
	}

	return { successCount, failureCount };
}

function displayModuleResults(moduleResult: TestModuleResult): Stats {
	console.log(`${moduleResult.testModule.path} [${moduleResult.milliseconds}ms]`);
	console.log();

	let successCount = 0;
	let failureCount = 0;

	let extraLine = true;

	for (const result of moduleResult.results) {
		const { testFunction: { propertyPath }, milliseconds } = result;
		const identifier = propertyPath.join(".");

		if (result.outcome === "failure") {
			// ✗
			// ❌

			if (!extraLine) {
				console.log();
			}

			console.log(` ❌  ${identifier} [${milliseconds}ms]`);
			console.log(prefixLines("    ", getErrorString(result.error)));
			console.log();

			failureCount++;
		} else {
			// ✅
			// ✓
			console.log(` ✅  ${identifier} [${milliseconds}ms]`);
			successCount++;
		}

		extraLine = result.outcome === "failure";
	}

	if (!extraLine) {
		console.log();
	}

	return { successCount, failureCount };
}

function getErrorString(error: any): string {
	if (error instanceof Error) {
		if (
			typeof error.constructor === 'function' &&
			error.constructor.name === 'AssertEqualsError' &&
			(<any>error).actual !== undefined &&
			(<any>error).expected !== undefined
		) {
			// TODO: Inspect these values in a nice way
			const actual = JSON.stringify((<any>error).actual);
			const expected = JSON.stringify((<any>error).expected);
			return `Actual:   ${actual}\nExpected: ${expected}\n${error.stack}`;
		}

		return error.stack;
	}

	// TODO: Inspect this value in a nice way
	return `Thrown value: ${JSON.stringify(error)}`;
}
