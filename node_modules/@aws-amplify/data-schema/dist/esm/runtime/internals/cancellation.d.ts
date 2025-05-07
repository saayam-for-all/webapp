import { BaseClient } from '../bridge-types';
export declare function extendCancellability<T>(existingCancellablePromise: Promise<T>, newPromiseToRegister: Promise<any>): Promise<T>;
/**
 * Wraps the existing `cancel()` method with logic to iteratively search for
 * the corresponding base level promise, if needed, that the core graphql client
 * knows how to cancel.
 *
 * @param client
 */
export declare function upgradeClientCancellation(client: BaseClient): void;
