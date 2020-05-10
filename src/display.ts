import { ResultAggregator, TestModule, TestFunction, TestModuleResult, TestFunctionResult } from "./interfaces.ts";
import { prefixLines } from "https://cdn.rawgit.com/qoh/utility/v0.0.1/src/string.ts";

interface CurrentModuleState {
	module: TestModule;
	hasExtraLine: boolean;
}

export class TerminalDisplayResultAggregator implements ResultAggregator {
	private currentModuleState: CurrentModuleState | null = null;

	private successCount = 0;
	private failureCount = 0;

	private maybeStartModule(mod: TestModule) {
		if (this.currentModuleState === null) {
			this.currentModuleState = {
				module: mod,
				hasExtraLine: true,
			};

			console.log(mod.path);
			console.log();
		} else if (this.currentModuleState.module !== mod) {
			throw new Error("Missing moduleFinish call (does not support parallel)");
		}
	}

	testFinish(mod: TestModule, result: TestFunctionResult) {
		this.maybeStartModule(mod);

		const { testFunction: { propertyPath }, milliseconds } = result;
		const identifier = propertyPath.join(".");

		if (result.outcome === "failure") {
			// ✗
			// ❌

			if (!this.currentModuleState!.hasExtraLine) {
				console.log();
			}

			console.log(`  ❌  ${identifier} [${milliseconds}ms]`);
			console.log(prefixLines("      ", getErrorString(result.error)));
			console.log();

			this.failureCount++;
		} else {
			// ✅
			// ✓
			console.log(`  ✅  ${identifier} [${milliseconds}ms]`);
			this.successCount++;
		}

		this.currentModuleState!.hasExtraLine = result.outcome === "failure";
	}

	moduleFinish(mod: TestModule, elapsedMilliseconds: number) {
		this.maybeStartModule(mod);

		if (!this.currentModuleState!.hasExtraLine) {
			console.log();
		}

		// console.log(`  [${elapsedMilliseconds}ms]`);
		// console.log();

		this.currentModuleState = null;
	}

	suiteFinish() {
		const resultCount = this.successCount + this.failureCount;
		console.log(`${this.successCount}/${resultCount} succeeded, ${this.failureCount} failed`);
	}
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

		return error.stack ?? error.toString();
	}

	// TODO: Inspect this value in a nice way
	return `Thrown value: ${JSON.stringify(error)}`;
}
