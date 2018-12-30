import { stat, ErrorKind } from "deno";

export async function isLocalDirectory(path: string): Promise<boolean> {
	// TODO: Check that it is local first.

	try {
		return (await stat(path)).isDirectory();
	} catch (error) {
		if (error.kind === ErrorKind.NotFound) {
			return false;
		}

		throw error;
	}
}
