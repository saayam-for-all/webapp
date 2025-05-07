/**
 * @template {SubProcessOptions} TSubProcessOptions
 */
export class SubProcess<TSubProcessOptions extends SubProcessOptions> extends EventEmitter<[never]> {
    /**
     * @param {string} cmd
     * @param {string[]} [args=[]]
     * @param {TSubProcessOptions} [opts]
     */
    constructor(cmd: string, args?: string[], opts?: TSubProcessOptions);
    /**
     * @callback StartDetector
     * @param {TSubProcessOptions extends TIsBufferOpts ? Buffer : string} stdout
     * @param {TSubProcessOptions extends TIsBufferOpts ? Buffer : string} [stderr]
     * @returns {any}
     */
    /** @type {import('child_process').ChildProcess | null} */
    proc: import("child_process").ChildProcess | null;
    /** @type {string[]} */
    args: string[];
    /**
     * @type {string}
     */
    cmd: string;
    /**
     * @type {SubProcessOptions}
    */
    opts: SubProcessOptions;
    /**
     * @type {boolean}
     */
    expectingExit: boolean;
    /**
     * @type {string}
     */
    rep: string;
    get isRunning(): boolean;
    /**
     *
     * @param {string} streamName
     * @param {Iterable<string>|string} lines
     */
    emitLines(streamName: string, lines: Iterable<string> | string): void;
    /**
     * spawn the subprocess and return control whenever we deem that it has fully
     * "started"
     *
     * @param {StartDetector|number?} startDetector
     * @param {number?} timeoutMs
     * @param {boolean} detach
     * @returns {Promise<void>}
     */
    start(startDetector?: ((stdout: TSubProcessOptions extends TIsBufferOpts ? Buffer : string, stderr?: (TSubProcessOptions extends TIsBufferOpts ? Buffer<ArrayBufferLike> : string) | undefined) => any) | (number | null), timeoutMs?: number | null, detach?: boolean): Promise<void>;
    /**
     * @deprecated This method is deprecated and will be removed
     */
    handleLastLines(): void;
    /**
     *
     * @param {NodeJS.Signals} signal
     * @param {number} timeout
     * @returns {Promise<void>}
     */
    stop(signal?: NodeJS.Signals, timeout?: number): Promise<void>;
    join(allowedExitCodes?: number[]): Promise<any>;
    detachProcess(): void;
    get pid(): number | null | undefined;
}
export default SubProcess;
export type SubProcessCustomOptions = {
    isBuffer?: boolean | undefined;
    encoding?: string | undefined;
};
export type SubProcessOptions = SubProcessCustomOptions & import("child_process").SpawnOptionsWithoutStdio;
export type TIsBufferOpts = {
    isBuffer: true;
};
import { EventEmitter } from 'events';
//# sourceMappingURL=subprocess.d.ts.map