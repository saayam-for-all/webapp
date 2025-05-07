'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStorageOperationInputWithPrefix = void 0;
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const validation_1 = require("../../../errors/types/validation");
const constants_1 = require("./constants");
const resolveIdentityId_1 = require("./resolveIdentityId");
// Local assertion function with StorageOperationInputWithPrefixPath as Input
const _isInputWithPath = (input) => {
    return input.path !== undefined;
};
const validateStorageOperationInputWithPrefix = (input, identityId) => {
    // Validate prefix & path not present at the same time
    (0, assertValidationError_1.assertValidationError)(!(input.prefix && input.path), validation_1.StorageValidationErrorCode.InvalidStorageOperationPrefixInput);
    if (_isInputWithPath(input)) {
        const { path } = input;
        const objectKey = typeof path === 'string'
            ? path
            : path({ identityId: (0, resolveIdentityId_1.resolveIdentityId)(identityId) });
        // Assert on no leading slash in the path parameter
        (0, assertValidationError_1.assertValidationError)(!objectKey.startsWith('/'), validation_1.StorageValidationErrorCode.InvalidStoragePathInput);
        return {
            inputType: constants_1.STORAGE_INPUT_PATH,
            objectKey,
        };
    }
    else {
        return { inputType: constants_1.STORAGE_INPUT_PREFIX, objectKey: input.prefix ?? '' };
    }
};
exports.validateStorageOperationInputWithPrefix = validateStorageOperationInputWithPrefix;
//# sourceMappingURL=validateStorageOperationInputWithPrefix.js.map
