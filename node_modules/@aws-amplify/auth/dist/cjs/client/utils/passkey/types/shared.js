'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidCredentialCreationOptions = void 0;
const errors_1 = require("../errors");
function assertValidCredentialCreationOptions(credentialCreationOptions) {
    (0, errors_1.assertPasskeyError)([
        !!credentialCreationOptions,
        !!credentialCreationOptions?.challenge,
        !!credentialCreationOptions?.user,
        !!credentialCreationOptions?.rp,
        !!credentialCreationOptions?.pubKeyCredParams,
    ].every(Boolean), errors_1.PasskeyErrorCode.InvalidPasskeyRegistrationOptions);
}
exports.assertValidCredentialCreationOptions = assertValidCredentialCreationOptions;
//# sourceMappingURL=shared.js.map
