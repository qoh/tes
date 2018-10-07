export async function ok() {
	// all good, your tests may be async
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
