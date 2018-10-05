export function ok() { }
export function yep() { }
export function thanks() { }

export async function helloWorld() {
	await delay(1000);
	throw new Error("belated ow");
}

export default {
	foo() {
		throw new Error("ow");
	}
}

export const cat = {
	barring() { throw "away"; }
}

function delay(milliseconds: number) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}
