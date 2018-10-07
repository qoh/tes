export interface TestModule {
	path: string;
	functions: TestFunction[];
}

export interface TestFunction {
	propertyPath: string[];
	fn: Function;
}
