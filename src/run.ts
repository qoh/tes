import { Test } from "./interfaces";

export type TestResult = TestSuccess | TestFailure;

interface TestResultBase {
	test: Test;
	milliseconds: number;
}

export interface TestSuccess extends TestResultBase {
	outcome: 'success';
}

export interface TestFailure extends TestResultBase {
	outcome: 'failure';
	error: any;
}

export async function runTests(tests: Test[]): Promise<TestResult[]> {
	return Promise.all(tests.map(runTest));
}

export async function runTest(test: Test): Promise<TestResult> {
	const start = Date.now();

	try {
		await test.function();
	} catch (error) {
		const milliseconds = Date.now() - start;
		return { test, milliseconds, error, outcome: 'failure' };
	}

	const milliseconds = Date.now() - start;
	return { test, milliseconds, outcome: 'success' };
}
