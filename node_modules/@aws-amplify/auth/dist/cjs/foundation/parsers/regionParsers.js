'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionFromIdentityPoolId = exports.getRegionFromUserPoolId = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const AuthError_1 = require("../../errors/AuthError");
function getRegionFromUserPoolId(userPoolId) {
    const region = userPoolId?.split('_')[0];
    if (!userPoolId ||
        userPoolId.indexOf('_') < 0 ||
        !region ||
        typeof region !== 'string')
        throw new AuthError_1.AuthError({
            name: 'InvalidUserPoolId',
            message: 'Invalid user pool id provided.',
        });
    return region;
}
exports.getRegionFromUserPoolId = getRegionFromUserPoolId;
function getRegionFromIdentityPoolId(identityPoolId) {
    if (!identityPoolId || !identityPoolId.includes(':')) {
        throw new AuthError_1.AuthError({
            name: 'InvalidIdentityPoolIdException',
            message: 'Invalid identity pool id provided.',
            recoverySuggestion: 'Make sure a valid identityPoolId is given in the config.',
        });
    }
    return identityPoolId.split(':')[0];
}
exports.getRegionFromIdentityPoolId = getRegionFromIdentityPoolId;
//# sourceMappingURL=regionParsers.js.map
