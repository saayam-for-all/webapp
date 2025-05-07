import { RestApiError } from './RestApiError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Internal-only class for CanceledError.
 *
 * @internal
 */
class CanceledError extends RestApiError {
    constructor(params = {}) {
        super({
            name: 'CanceledError',
            message: 'Request is canceled by user',
            ...params,
        });
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = CanceledError;
        Object.setPrototypeOf(this, CanceledError.prototype);
    }
}
/**
 * Check if an error is caused by user calling `cancel()` in REST API.
 *
 * @note This function works **ONLY** for errors thrown by REST API. For GraphQL APIs, use `client.isCancelError(error)`
 *   instead. `client` is generated from  `generateClient()` API from `aws-amplify/api`.
 *
 * @param {unknown} error The unknown exception to be checked.
 * @returns - A boolean indicating if the error was from an upload cancellation
 */
const isCancelError = (error) => !!error && error instanceof CanceledError;

export { CanceledError, isCancelError };
//# sourceMappingURL=CanceledError.mjs.map
