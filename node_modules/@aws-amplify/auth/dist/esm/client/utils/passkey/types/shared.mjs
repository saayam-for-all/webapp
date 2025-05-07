import { assertPasskeyError, PasskeyErrorCode } from '../errors.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function assertValidCredentialCreationOptions(credentialCreationOptions) {
    assertPasskeyError([
        !!credentialCreationOptions,
        !!credentialCreationOptions?.challenge,
        !!credentialCreationOptions?.user,
        !!credentialCreationOptions?.rp,
        !!credentialCreationOptions?.pubKeyCredParams,
    ].every(Boolean), PasskeyErrorCode.InvalidPasskeyRegistrationOptions);
}

export { assertValidCredentialCreationOptions };
//# sourceMappingURL=shared.mjs.map
