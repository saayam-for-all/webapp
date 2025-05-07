import { AuthError } from '../../../errors/AuthError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * It will retry the function if the error is a `ResourceNotFoundException` and
 * will clean the device keys stored in the storage mechanism.
 *
 */
async function retryOnResourceNotFoundException(func, args, username, tokenOrchestrator) {
    try {
        return await func(...args);
    }
    catch (error) {
        if (error instanceof AuthError &&
            error.name === 'ResourceNotFoundException' &&
            error.message.includes('Device does not exist.')) {
            await tokenOrchestrator.clearDeviceMetadata(username);
            return func(...args);
        }
        throw error;
    }
}

export { retryOnResourceNotFoundException };
//# sourceMappingURL=retryOnResourceNotFoundException.mjs.map
