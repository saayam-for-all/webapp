/**
 * Executes an `async` resolver function, providing the `Promise`-to-be-returned as the
 * first argument to the resolver so that the resolver can refer to the `Promise` that
 * external callers will see.
 *
 * ```ts
 * const outer = selfAwareAsync(async inner => {
 *  console.log(outer === inner); // true
 * });
 * ```
 *
 * This utility exists to reduce boilerplate in cases where promise resolving code needs
 * to track or register its "own" `Promise` *as seen by the caller* in some way. E.g.,
 * when mapping `Promise` chains for `client.cancel()`.
 *
 * @param resolver
 * @returns
 */
function selfAwareAsync(resolver) {
    let resolve;
    let reject;
    const resultPromise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    resolver(resultPromise)
        .then((result) => {
        resolve(result);
    })
        .catch((error) => {
        reject(error);
    });
    return resultPromise;
}

export { selfAwareAsync };
//# sourceMappingURL=selfAwareAsync.mjs.map
