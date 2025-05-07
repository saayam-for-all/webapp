import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';
import { StorageValidationErrorCode } from '../../../errors/types/validation.mjs';
import { isInputWithPath } from './isInputWithPath.mjs';
import { STORAGE_INPUT_PATH, STORAGE_INPUT_KEY } from './constants.mjs';
import { resolveIdentityId } from './resolveIdentityId.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const validateStorageOperationInput = (input, identityId) => {
    assertValidationError(
    // Key present without a path
    (!!input.key && !input.path) ||
        // Path present without a key
        (!input.key && !!input.path), StorageValidationErrorCode.InvalidStorageOperationInput);
    if (isInputWithPath(input)) {
        const { path } = input;
        const objectKey = typeof path === 'string'
            ? path
            : path({ identityId: resolveIdentityId(identityId) });
        assertValidationError(!objectKey.startsWith('/'), StorageValidationErrorCode.InvalidStoragePathInput);
        return {
            inputType: STORAGE_INPUT_PATH,
            objectKey,
        };
    }
    else {
        return { inputType: STORAGE_INPUT_KEY, objectKey: input.key };
    }
};

export { validateStorageOperationInput };
//# sourceMappingURL=validateStorageOperationInput.mjs.map
