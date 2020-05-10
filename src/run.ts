import { TestModule, TestFunction, TestModuleResult, TestFunctionResult, TestSuccess, TestFailure, ResultAggregator } from "./interfaces.ts";

export async function runTestModules(
	aggregator: ResultAggregator,
	testModules: TestModule[],
) {
	await Promise.all(testModules.map(runTestModule.bind(null, aggregator)));
	aggregator.suiteFinish();
}

export async function runTestModule(
	aggregator: ResultAggregator,
	testModule: TestModule,
): Promise<TestModuleResult> {
	const start = Date.now();
	const results = await Promise.all(testModule.functions.map(
		runTestFunctionAggregate.bind(null, aggregator, testModule)));
	const milliseconds = Date.now() - start;
	aggregator.moduleFinish(testModule, milliseconds);

	return {
		testModule,
		milliseconds,
		results,
	};
}

async function runTestFunctionAggregate(
	aggregator: ResultAggregator,
	testModule: TestModule,
	testFunction: TestFunction,
): Promise<TestFunctionResult> {
	const result = await runTestFunction(testFunction);
	aggregator.testFinish(testModule, result);
	return result;
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
