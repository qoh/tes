# Summary

Teset (pronounced Tessie) is a test runner for [deno](https://github.com/denoland/deno) based on simple concepts: exporting tests as functions (potentially nested or async), and throwing to indicate failure.

Write a test file like `example.ts`:

```javascript
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
```

Then run it:

```
teset example
```

```
Finding tests
Found 4 tests, running

/path/to/.../example [0ms]

 ✅  ok [0ms]

 ❌  fail [0ms]
    Error: Snowball not calibrated
        at Object.fail [as fn ] (file:///.../example.ts:6:8)
        at ...

 ✅  nested.flint [0ms]
 ✅  nested.deeply.chance [0ms]

3/4 succeeded, 1 failed
```

## Try it

You can try this right now without installing if you have deno:

```shell
deno https://cdn.rawgit.com/qoh/teset/v0.2.0/src/main \
     https://cdn.rawgit.com/qoh/teset/v0.2.0/test/example
```

Or with a local file:

```shell
deno https://cdn.rawgit.com/qoh/teset/v0.2.0/src/main example
```

# Test API

For assertions, see [assert](https://github.com/qoh/assert).

```javascript
import { ... } from "https://cdn.rawgit.com/qoh/teset/v0.2.0/src/api.ts";
```

---

```typescript
function throws(test: Function): () => Promise<void>;
function throws(constructor: Function, test: Function): () => Promise<void>;
function throws(message: string, test: Function): () => Promise<void>;
function throws(constructor: Function, message: string, test: Function): () => Promise<void>;
```

Create a test that expects `test` to throw.

Given `constructor`, the error is asserted to be an instance of it.

Given `message`, the message of the error is asserted to be equal.

```javascript
export const fails = throws(TypeError, "null is not a function", () => {
    null();
});
```
