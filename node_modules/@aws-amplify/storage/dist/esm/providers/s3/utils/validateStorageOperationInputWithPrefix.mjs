import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { StorageValidationErrorCode } from '../../../errors/types/validation.mjs';
import { STORAGE_INPUT_PATH, STORAGE_INPUT_PREFIX } from './constants.mjs';
import { resolveIdentityId } from './resolveIdentityId.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Local assertion function with StorageOperationInputWithPrefixPath as Input
const _isInputWithPath = (input) => {
    return input.path !== undefined;
};
const validateStorageOperationInputWithPrefix = (input, identityId) => {
    // Validate prefix & path not present at the same time
    assertValidationError(!(input.prefix && input.path), StorageValidationErrorCode.InvalidStorageOperationPrefixInput);
    if (_isInputWithPath(input)) {
        const { path } = input;
        const objectKey = typeof path === 'string'
            ? path
            : path({ identityId: resolveIdentityId(identityId) });
        // Assert on no leading slash in the path parameter
        assertValidationError(!objectKey.startsWith('/'), StorageValidationErrorCode.InvalidStoragePathInput);
        return {
            inputType: STORAGE_INPUT_PATH,
            objectKey,
        };
    }
    else {
        return { inputType: STORAGE_INPUT_PREFIX, objectKey: input.prefix ?? '' };
    }
};

export { validateStorageOperationInputWithPrefix };
//# sourceMappingURL=validateStorageOperationInputWithPrefix.mjs.map
