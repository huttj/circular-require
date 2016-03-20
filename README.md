# Explanation

This gist demonstrates a potential pitfall lurking behind how `require` handles [circular dependencies](https://nodejs.org/docs/latest/api/modules.html#modules_cycles).

Essentially, when a module `a` requires another module `b`, the execution of the original module suspends, and the second module is parsed and executed. If that second module `b` then requires the original `a`, an incomplete version of the original, which includes whichever exports had been added to `a` before `b` was required. Once `b` is completely parsed and executed, `a` resumes execution.

If, after this, a line in `a` sets `module.exports` to something, the reference that `b` has to the incomplete version of `a` is broken. That is, `b`'s reference to `a` still refers to the incomplete version it was given, while `a`, for all intents and purposes, considers itself to be whatever `module.exports` was sent to.

In the pathological case, this results in `b`'s reference to `a` actually being a reference to an empty object, while every other module that requires `a` gets the actual exports.

This behavior can be seen in `broken/test.js`. Both calls *should* result in similar logs, but the call to `b.fn()` actually logs out an empty object. We confirm that the `test` module gets the full copy of `a` by logging it out to the console. Indeed, it has the `fn` function.

In the fixed case, exports are assigned as *properties* on the `exports` object, which means that the `b`'s reference to `a` is not broken, but the object that it refers to is updated. This means that the properties are added to the incomplete version that `b` sees, once execution of `a` resumes. Therefore, when `b` refers to `a`, it is the same `a` that `test.js` itself requires.