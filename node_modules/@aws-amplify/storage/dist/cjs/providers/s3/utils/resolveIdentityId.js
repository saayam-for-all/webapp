'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveIdentityId = void 0;
const validation_1 = require("../../../errors/types/validation");
const assertValidationError_1 = require("../../../errors/utils/assertValidationError");
const resolveIdentityId = (identityId) => {
    (0, assertValidationError_1.assertValidationError)(!!identityId, validation_1.StorageValidationErrorCode.NoIdentityId);
    return identityId;
};
exports.resolveIdentityId = resolveIdentityId;
//# sourceMappingURL=resolveIdentityId.js.map
