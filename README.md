# Summary

Teset (pronounced Tessie) is a test runner for [deno](https://github.com/denoland/deno), based on the simple concept of exporting tests as functions and throwing to indicate failure.

Write a test file like `example.ts`:

```typescript
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
```

Then just run it:

```
teset example
```

```
Finding tests
Found 4 tests, running

 ✅  ok in /.../example [0ms]

 ❌  fail in /.../example [0ms]
    Error: Snowball not calibrated
        at Object.fail [as function ] (file:///.../example.ts:6:8)
        at runTest (file:///.../teset/src/run.ts:27:22)
        at Array.map (<anonymous>)
        at Object.runTests (file:///.../teset/src/run.ts:20:27)
        at main (file:///.../teset/src/main.ts:13:24)

 ✅  nested.flint in /.../example [0ms]
 ✅  nested.deeply.chance in /.../example [0ms]

3/4 succeeded, 1 failed
```

You can try this right now without installing if you have deno:

```shell
deno https://cdn.rawgit.com/qoh/teset/v0.1.1/src/main.ts \
     https://cdn.rawgit.com/qoh/teset/v0.1.1/test/example.ts
```

Or with a local file:

```shell
deno https://cdn.rawgit.com/qoh/teset/v0.1.1/src/main.ts example
```
