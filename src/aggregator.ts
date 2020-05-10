import { ResultAggregator, TestModule, TestFunctionResult } from "./interfaces.ts";

export class ErrorDetectAggregator implements ResultAggregator {
	private failure = false;

	testFinish(mod: TestModule, result: TestFunctionResult): void {
		this.failure = this.failure || result.outcome === "failure";
	}

	moduleFinish(mod: TestModule, milliseconds: number): void { }
	suiteFinish(): void { }

	hasFailure(): boolean {
		return this.failure;
	}
}

export class MultipleAggregator implements ResultAggregator {
	constructor(private readonly aggregators: ResultAggregator[]) { }

	testFinish(mod: TestModule, result: TestFunctionResult): void {
		for (const aggregator of this.aggregators) {
			aggregator.testFinish(mod, result);
		}
	}

	moduleFinish(mod: TestModule, milliseconds: number): void {
		for (const aggregator of this.aggregators) {
			aggregator.moduleFinish(mod, milliseconds);
		}
	}

	suiteFinish(): void {
		for (const aggregator of this.aggregators) {
			aggregator.suiteFinish();
		}
	}
}

interface WaitingModuleState {
	tests: TestFunctionResult[];
	finish: { milliseconds: number } | null;
}

export class SerialAggregator implements ResultAggregator {
	private currentModule: TestModule | null = null;
	private readonly waiting = new Map<TestModule, WaitingModuleState>();
	private suiteFinished = false;

	constructor(private readonly inner: ResultAggregator) { }

	testFinish(mod: TestModule, result: TestFunctionResult) {
		if (this.currentModule === null || this.currentModule === mod) {
			this.currentModule = mod;
			this.inner.testFinish(mod, result);
		} else {
			this.waitingFor(mod).tests.push(result);
		}
	}

	moduleFinish(mod: TestModule, milliseconds: number) {
		if (this.currentModule === null || this.currentModule === mod) {
			this.inner.moduleFinish(mod, milliseconds);
			this.processWaiting();
		} else {
			this.waitingFor(mod).finish = { milliseconds };
		}
	}

	suiteFinish() {
		if (this.currentModule === null) {
			this.inner.suiteFinish();
		} else {
			this.suiteFinished = true;
		}
	}

	private waitingFor(mod: TestModule): WaitingModuleState {
		let state = this.waiting.get(mod);
		if (state === undefined) {
			state = { tests: [], finish: null };
			this.waiting.set(mod, state);
		}
		return state;
	}

	private processWaiting() {
		const entries = Array.from(this.waiting.entries());

		for (const [mod, state] of entries) {
			if (state.finish !== null) {
				for (const result of state.tests) {
					this.inner.testFinish(mod, result);
				}
				this.inner.moduleFinish(mod, state.finish.milliseconds);
				this.waiting.delete(mod);
			}
		}

		for (const [mod, state] of entries) {
			if (state.finish === null) {
				this.currentModule = mod;
				for (const result of state.tests) {
					this.inner.testFinish(mod, result);
				}
				this.waiting.delete(mod);
				return;
			}
		}

		if (this.suiteFinished) {
			this.suiteFinished = false;
			this.inner.suiteFinish();
		}
	}
}
