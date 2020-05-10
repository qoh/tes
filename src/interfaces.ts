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

export interface ResultAggregator {
	testFinish(mod: TestModule, result: TestFunctionResult): void;
	moduleFinish(mod: TestModule, milliseconds: number): void;
	suiteFinish(): void;
}

export interface TestModule {
	path: string;
	functions: TestFunction[];
}

export interface TestFunction {
	propertyPath: string[];
	fn: Function;
}
