import { AmplifyErrorCode } from '@aws-amplify/core/internals/utils';
import { StorageError } from './StorageError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class IntegrityError extends StorageError {
    constructor(params = {
        name: AmplifyErrorCode.Unknown,
        message: 'An unknown error has occurred.',
        recoverySuggestion: 'This may be a bug. Please reach out to library authors.',
    }) {
        super(params);
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = IntegrityError;
        Object.setPrototypeOf(this, IntegrityError.prototype);
    }
}

export { IntegrityError };
//# sourceMappingURL=IntegrityError.mjs.map
