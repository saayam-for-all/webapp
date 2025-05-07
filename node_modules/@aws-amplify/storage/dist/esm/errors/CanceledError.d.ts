import { AmplifyErrorParams } from '@aws-amplify/core/internals/utils';
import { StorageError } from './StorageError';
/**
 * Internal-only class for CanceledError thrown by XHR handler or multipart upload when cancellation is invoked
 * without overwriting behavior.
 *
 * @internal
 */
export declare class CanceledError extends StorageError {
    constructor(params?: Partial<AmplifyErrorParams>);
}
/**
 * Check if an error is caused by user calling `cancel()` on a upload/download task. If an overwriting error is
 * supplied to `task.cancel(errorOverwrite)`, this function will return `false`.
 * @param {unknown} error The unknown exception to be checked.
 * @returns - A boolean indicating if the error was from an upload cancellation
 */
export declare const isCancelError: (error: unknown) => error is CanceledError;
