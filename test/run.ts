import { assertEquals } from "https://cdn.rawgit.com/qoh/assert/v0.0.1/src/index.ts";
import { runTestFunction } from "../src/run.ts";
import { TestFunction } from "../src/interfaces.ts";

// TODO: Test runTests

export function syncSuccess() {
	expectResult(
		makeTestFunction(() => { }),
		{ outcome: "success" },
	);
}

export async function asyncSuccess() {
	await expectResult(
		makeTestFunction(async () => { }),
		{ outcome: "success" },
	);
}

export function syncFailure() {
	const error = {};
	expectResult(
		makeTestFunction(() => { throw error; }),
		{ outcome: "failure", error },
	);
}

export async function asyncFailure() {
	const error = {};
	await expectResult(
		makeTestFunction(async () => { throw error; }),
		{ outcome: "failure", error },
	);
}

type Expected = ExpectedSuccess | ExpectedFailure;

interface ExpectedSuccess {
	outcome: "success";
}

interface ExpectedFailure {
	outcome: "failure";
	error: any;
}

async function expectResult(testFunction: TestFunction, expected: Expected) {
	const actual = await runTestFunction(testFunction);
	const base = { testFunction, milliseconds: actual.milliseconds };

	if (expected.outcome === "success") {
		assertEquals(actual, { ...base, outcome: "success" });
	} else {
		assertEquals(actual, { ...base, outcome: "failure", error: expected.error });
	}
}

function makeTestFunction(fn: () => any): TestFunction {
	return {
		propertyPath: ["functionTest"],
		fn,
	};
}
