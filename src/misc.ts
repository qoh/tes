export async function isLocalDirectory(path: string): Promise<boolean> {
	// TODO: Check that it is local first.

	try {
		return (await Deno.stat(path)).isDirectory;
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			return false;
		}

		throw error;
	}
}
