/***
 * Log an error to the console and exit the process.
 * @param {boolean} json - whether we should log json or text
 * @param {any} msg - error message, object, Error instance, etc.
 */
export function errAndQuit(json: boolean, msg: any): void;
/**
 * Conditionally log something to the console
 * @param {boolean} json - whether we are in json mode (and should therefore not log)
 * @param {string} msg - string to log
 */
export function log(json: boolean, msg: string): void;
/**
 * Start a spinner, execute an async function, and then stop the spinner
 * @param {boolean} json - whether we are in json mode (and should therefore not log)
 * @param {string} msg - string to log
 * @param {function} fn - function to wrap with spinning
 */
export function spinWith(json: boolean, msg: string, fn: Function): Promise<any>;
export const JSON_SPACES: 4;
export class RingBuffer {
    constructor(size?: number);
    size: number;
    buffer: any[];
    getBuff(): any[];
    dequeue(): void;
    enqueue(item: any): void;
}
//# sourceMappingURL=utils.d.ts.map