'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsPasskeySupported = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
/**
 * Determines if passkey is supported in current context
 * Will return false if executed in non-secure context
 * @returns boolean
 */
const getIsPasskeySupported = () => {
    return ((0, utils_1.isBrowser)() &&
        window.isSecureContext &&
        'credentials' in navigator &&
        typeof window.PublicKeyCredential === 'function');
};
exports.getIsPasskeySupported = getIsPasskeySupported;
//# sourceMappingURL=getIsPasskeySupported.js.map
