'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStorageOperationInput = void 0;
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const validation_1 = require("../../../errors/types/validation");
const isInputWithPath_1 = require("./isInputWithPath");
const constants_1 = require("./constants");
const resolveIdentityId_1 = require("./resolveIdentityId");
const validateStorageOperationInput = (input, identityId) => {
    (0, assertValidationError_1.assertValidationError)(
    // Key present without a path
    (!!input.key && !input.path) ||
        // Path present without a key
        (!input.key && !!input.path), validation_1.StorageValidationErrorCode.InvalidStorageOperationInput);
    if ((0, isInputWithPath_1.isInputWithPath)(input)) {
        const { path } = input;
        const objectKey = typeof path === 'string'
            ? path
            : path({ identityId: (0, resolveIdentityId_1.resolveIdentityId)(identityId) });
        (0, assertValidationError_1.assertValidationError)(!objectKey.startsWith('/'), validation_1.StorageValidationErrorCode.InvalidStoragePathInput);
        return {
            inputType: constants_1.STORAGE_INPUT_PATH,
            objectKey,
        };
    }
    else {
        return { inputType: constants_1.STORAGE_INPUT_KEY, objectKey: input.key };
    }
};
exports.validateStorageOperationInput = validateStorageOperationInput;
//# sourceMappingURL=validateStorageOperationInput.js.map
