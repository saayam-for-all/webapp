export default exec;
/**
 * Options on top of `SpawnOptions`, unique to `teen_process.`
 */
export type TeenProcessProps = {
    /**
     * - Ignore & discard all output
     */
    ignoreOutput?: boolean | undefined;
    /**
     * - Return output as a Buffer
     */
    isBuffer?: boolean | undefined;
    /**
     * - Logger to use for debugging
     */
    logger?: TeenProcessLogger | undefined;
    /**
     * - Maximum size of `stdout` buffer
     */
    maxStdoutBufferSize?: number | undefined;
    /**
     * - Maximum size of `stderr` buffer
     */
    maxStderrBufferSize?: number | undefined;
    /**
     * - Encoding to use for output
     */
    encoding?: BufferEncoding | undefined;
};
/**
 * A logger object understood by {@link exec teen_process.exec}.
 */
export type TeenProcessLogger = {
    debug: (...args: any[]) => void;
};
/**
 * Options for {@link exec teen_process.exec}.
 */
export type TeenProcessExecOptions = import("child_process").SpawnOptions & TeenProcessProps;
/**
 * The value {@link exec teen_process.exec} resolves to when `isBuffer` is `false`
 */
export type TeenProcessExecStringResult = {
    /**
     * - Stdout
     */
    stdout: string;
    /**
     * - Stderr
     */
    stderr: string;
    /**
     * - Exit code
     */
    code: number | null;
};
/**
 * The value {@link exec teen_process.exec} resolves to when `isBuffer` is `true`
 */
export type TeenProcessExecBufferResult = {
    /**
     * - Stdout
     */
    stdout: Buffer;
    /**
     * - Stderr
     */
    stderr: Buffer;
    /**
     * - Exit code
     */
    code: number | null;
};
/**
 * Extra props {@link exec teen_process.exec} adds to its error objects
 */
export type TeenProcessExecErrorProps = {
    /**
     * - STDOUT
     */
    stdout: string;
    /**
     * - STDERR
     */
    stderr: string;
    /**
     * - Exit code
     */
    code: number | null;
};
/**
 * Error thrown by {@link exec teen_process.exec}
 */
export type TeenProcessExecError = Error & TeenProcessExecErrorProps;
export type BufferProp<MaybeBuffer extends {
    isBuffer?: boolean;
}> = MaybeBuffer["isBuffer"];
/**
 * Spawns a process
 * @template {TeenProcessExecOptions} T
 * @param {string} cmd - Program to execute
 * @param {string[]} [args] - Arguments to pass to the program
 * @param {T} [originalOpts] - Options
 * @returns {Promise<BufferProp<T> extends true ? TeenProcessExecBufferResult : TeenProcessExecStringResult>}
 */
export function exec<T extends TeenProcessExecOptions>(cmd: string, args?: string[], originalOpts?: T): Promise<BufferProp<T> extends true ? TeenProcessExecBufferResult : TeenProcessExecStringResult>;
//# sourceMappingURL=exec.d.ts.map