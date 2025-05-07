/**
 * returns in-flight promise if there is one
 *
 * @param asyncFunction - asyncFunction to be deduped.
 * @returns - the return type of the callback
 */
export declare const deDupeAsyncFunction: <A extends any[], R>(asyncFunction: (...args: A) => Promise<R>) => (...args: A) => Promise<R>;
