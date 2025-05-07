'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBucketOwnerID = void 0;
const validation_1 = require("../../../errors/types/validation");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const VALID_AWS_ACCOUNT_ID_PATTERN = /^\d{12}/;
const validateBucketOwnerID = (accountID) => {
    if (accountID === undefined) {
        return;
    }
    (0, assertValidationError_1.assertValidationError)(VALID_AWS_ACCOUNT_ID_PATTERN.test(accountID), validation_1.StorageValidationErrorCode.InvalidAWSAccountID);
};
exports.validateBucketOwnerID = validateBucketOwnerID;
//# sourceMappingURL=validateBucketOwnerID.js.map
