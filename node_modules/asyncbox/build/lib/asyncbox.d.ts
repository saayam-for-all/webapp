/**
 * Options for {@link waitForCondition }
 */
export type WaitForConditionOptions = {
    waitMs?: number | undefined;
    intervalMs?: number | undefined;
    logger?: {
        debug: (...args: any[]) => void;
    } | undefined;
    error?: string | Error | undefined;
};
/**
 * Options for {@link longSleep }
 */
export type LongSleepOptions = {
    thresholdMs?: number | undefined;
    intervalMs?: number | undefined;
    progressCb?: ProgressCallback | null | undefined;
};
/**
 * Parameter provided to a {@link ProgressCallback }
 */
export type Progress = {
    elapsedMs: number;
    timeLeft: number;
    progress: number;
};
/**
 * Progress callback for {@link longSleep }
 */
export type ProgressCallback = (progress: Progress) => void;
/**
 * An async/await version of setTimeout
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms: number): Promise<void>;
/**
 * An async/await way of running a method until it doesn't throw an error
 * @template [T=any]
 * @param {number} times
 * @param {(...args: any[]) => Promise<T>} fn
 * @param  {...any} args
 * @returns {Promise<T?>}
 */
export function retry<T = any>(times: number, fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T | null>;
/**
 * Export async functions (Promises) and import this with your ES5 code to use
 * it with Node.
 * @template [R=any]
 * @param {any} promisey
 * @param {(err: any, value?: R) => void} cb
 * @returns {Promise<R>}
 */
export function nodeify<R = any>(promisey: any, cb: (err: any, value?: R | undefined) => void): Promise<R>;
/**
 * Node-ify an entire object of `Promise`-returning functions
 * @param {Record<string,(...args: any[]) => any>} promiseyMap
 * @returns {Record<string,(...args: any[])=>void>}
 */
export function nodeifyAll(promiseyMap: Record<string, (...args: any[]) => any>): Record<string, (...args: any[]) => void>;
/**
 * You can also use `retryInterval` to add a sleep in between retries. This can
 * be useful if you want to throttle how fast we retry.
 * @template [T=any]
 * @param {number} times
 * @param {number} sleepMs
 * @param {(...args: any[]) => Promise<T>} fn
 * @param  {...any} args
 * @returns {Promise<T?>}
 */
export function retryInterval<T = any>(times: number, sleepMs: number, fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T | null>;
/**
 * @param {(...args: any[]) => any|Promise<any>} fn
 * @param  {...any} args
 */
export function asyncify(fn: (...args: any[]) => any | Promise<any>, ...args: any[]): void;
export const parallel: typeof B.all;
/**
 * Similar to `Array.prototype.map`; runs in serial
 * @param {any[]} coll
 * @param {(value: any) => any|Promise<any>} mapper
 * @returns {Promise<any[]>}
 */
export function asyncmap(coll: any[], mapper: (value: any) => any | Promise<any>, runInParallel?: boolean): Promise<any[]>;
/**
 * Similar to `Array.prototype.filter`
 * @param {any[]} coll
 * @param {(value: any) => any|Promise<any>} filter
 * @param {boolean} runInParallel
 * @returns {Promise<any[]>}
 */
export function asyncfilter(coll: any[], filter: (value: any) => any | Promise<any>, runInParallel?: boolean): Promise<any[]>;
/**
 * Takes a condition (a function returning a boolean or boolean promise), and
 * waits until the condition is true.
 *
 * Throws a `/Condition unmet/` error if the condition has not been satisfied
 * within the allocated time, unless an error is provided in the options, as the
 * `error` property, which is either thrown itself, or used as the message.
 *
 * The condition result is returned if it is not falsy. If the condition throws an
 * error then this exception will be immediately passed through.
 *
 * The default options are: `{ waitMs: 5000, intervalMs: 500 }`
 * @template T
 * @param {() => Promise<T>|T} condFn
 * @param {WaitForConditionOptions} [options]
 * @returns {Promise<T>}
 */
export function waitForCondition<T>(condFn: () => T | Promise<T>, options?: WaitForConditionOptions | undefined): Promise<T>;
/**
 * Sometimes `Promise.delay` or `setTimeout` are inaccurate for large wait
 * times. To safely wait for these long times (e.g. in the 5+ minute range), you
 * can use `longSleep`.
 *
 * sYou can also pass a `progressCb` option which is a callback function that
 * receives an object with the properties `elapsedMs`, `timeLeft`, and
 * `progress`. This will be called on every wait interval so you can do your
 * wait logging or whatever.
 * @param {number} ms
 * @param {LongSleepOptions} [opts]
 * @returns {Promise<void>}
 */
export function longSleep(ms: number, { thresholdMs, intervalMs, progressCb, }?: LongSleepOptions | undefined): Promise<void>;
import B from 'bluebird';
//# sourceMappingURL=asyncbox.d.ts.map