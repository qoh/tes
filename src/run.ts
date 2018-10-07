import { TestModule, TestFunction } from "./interfaces";

export interface TestModuleResult {
	testModule: TestModule;
	milliseconds: number;
	results: TestFunctionResult[];
}

export type TestFunctionResult = TestSuccess | TestFailure;

interface TestResultBase {
	testFunction: TestFunction;
	milliseconds: number;
}

export interface TestSuccess extends TestResultBase {
	outcome: "success";
}

export interface TestFailure extends TestResultBase {
	outcome: "failure";
	error: any;
}

export async function runTestModules(testModules: TestModule[]): Promise<TestModuleResult[]> {
	return await Promise.all(testModules.map(runTestModule));
}

export async function runTestModule(testModule: TestModule): Promise<TestModuleResult> {
	const start = Date.now();
	const results = await Promise.all(testModule.functions.map(runTestFunction));
	const milliseconds = Date.now() - start;

	return {
		testModule,
		milliseconds,
		results,
	};
}

export async function runTestFunction(testFunction: TestFunction): Promise<TestFunctionResult> {
	const start = Date.now();

	try {
		await testFunction.fn();
	} catch (error) {
		const milliseconds = Date.now() - start;
		return { testFunction, milliseconds, error, outcome: "failure" };
	}

	const milliseconds = Date.now() - start;
	return { testFunction, milliseconds, outcome: "success" };
}
