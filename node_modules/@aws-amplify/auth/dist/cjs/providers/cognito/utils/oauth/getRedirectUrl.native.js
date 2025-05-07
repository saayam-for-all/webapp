'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedirectUrl = void 0;
const constants_1 = require("../../../../errors/constants");
/**
* - Validate there is always an appScheme (required), if not throw invalidAppSchemeException.
* - If a preferredRedirectUrl is given, validate it's in the configured list, if not throw invalidPreferredRedirectUrlException.
* - If preferredRedirectUrl is not given, use the appScheme which is present in the configured list.
@internal */
function getRedirectUrl(redirects, preferredRedirectUrl) {
    // iOS always requires a non http/s url (appScheme) to be registered so we validate it's existence here.
    const appSchemeRedirectUrl = redirects?.find(redirect => !redirect.startsWith('http://') && !redirect.startsWith('https://'));
    if (!appSchemeRedirectUrl) {
        throw constants_1.invalidAppSchemeException;
    }
    if (preferredRedirectUrl) {
        if (redirects?.includes(preferredRedirectUrl)) {
            return preferredRedirectUrl;
        }
        throw constants_1.invalidPreferredRedirectUrlException;
    }
    return appSchemeRedirectUrl;
}
exports.getRedirectUrl = getRedirectUrl;
//# sourceMappingURL=getRedirectUrl.native.js.map
