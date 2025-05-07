import { StorageValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const VALID_AWS_ACCOUNT_ID_PATTERN = /^\d{12}/;
const validateBucketOwnerID = (accountID) => {
    if (accountID === undefined) {
        return;
    }
    assertValidationError(VALID_AWS_ACCOUNT_ID_PATTERN.test(accountID), StorageValidationErrorCode.InvalidAWSAccountID);
};

export { validateBucketOwnerID };
//# sourceMappingURL=validateBucketOwnerID.mjs.map
