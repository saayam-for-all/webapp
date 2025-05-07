import { isBrowser } from '@aws-amplify/core/internals/utils';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Determines if passkey is supported in current context
 * Will return false if executed in non-secure context
 * @returns boolean
 */
const getIsPasskeySupported = () => {
    return (isBrowser() &&
        window.isSecureContext &&
        'credentials' in navigator &&
        typeof window.PublicKeyCredential === 'function');
};

export { getIsPasskeySupported };
//# sourceMappingURL=getIsPasskeySupported.mjs.map
