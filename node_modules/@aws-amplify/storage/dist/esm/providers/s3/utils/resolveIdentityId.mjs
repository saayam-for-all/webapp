import { StorageValidationErrorCode } from '../../../errors/types/validation.mjs';
import { assertValidationError } from '../../../errors/utils/assertValidationError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const resolveIdentityId = (identityId) => {
    assertValidationError(!!identityId, StorageValidationErrorCode.NoIdentityId);
    return identityId;
};

export { resolveIdentityId };
//# sourceMappingURL=resolveIdentityId.mjs.map
