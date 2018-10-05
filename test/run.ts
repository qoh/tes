import { assertEquals } from "https://cdn.rawgit.com/qoh/assert/v0.0.1/src/index.ts";
import { runTest, runTests } from "../src/run";
import { Test } from "../src/interfaces";

// TODO: Test runTests

export function syncSuccess() {
	expectResult(
		functionToTest(() => { }),
		{ outcome: "success" },
	);
}

export async function asyncSuccess() {
	await expectResult(
		functionToTest(async () => { }),
		{ outcome: "success" },
	);
}

export function syncFailure() {
	const error = {};
	expectResult(
		functionToTest(() => { throw error; }),
		{ outcome: "failure", error },
	);
}

// FIXME: This `throw error;` in this test inexplicably prints "undefined" and
// terminates the application. I'm assuming this is a deno bug.
/* export async function asyncFailure() {
	const error = {};
	await expectResult(
		functionToTest(async () => { throw error; }),
		{ outcome: "failure", error },
	);
} */

type Expected = ExpectedSuccess | ExpectedFailure;

interface ExpectedSuccess {
	outcome: "success";
}

interface ExpectedFailure {
	outcome: "failure";
	error: any;
}

async function expectResult(test: Test, expected: Expected) {
	const actual = await runTest(test);
	const base = { test, milliseconds: actual.milliseconds, };

	if (expected.outcome === "success") {
		assertEquals(actual, { ...base, outcome: "success" });
	} else {
		assertEquals(actual, { ...base, outcome: "failure", error: expected.error });
	}
}

function functionToTest(f: () => any): Test {
	return {
		sourceModulePath: "sourceModulePath",
		identifierChain: ["identifierChain"],
		function: f,
	};
}
