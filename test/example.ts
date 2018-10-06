export function ok() {
	// all good
}

export function fail() {
	throw new Error("Snowball not calibrated");
}

export const nested = {
	flint() { },
	deeply: {
		chance() { },
	},
};
