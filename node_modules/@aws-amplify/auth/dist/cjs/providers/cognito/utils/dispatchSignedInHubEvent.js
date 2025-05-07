'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchSignedInHubEvent = exports.ERROR_MESSAGE = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const getCurrentUser_1 = require("../apis/getCurrentUser");
const constants_1 = require("../../../errors/constants");
const AuthError_1 = require("../../../errors/AuthError");
exports.ERROR_MESSAGE = 'Unable to get user session following successful sign-in.';
const dispatchSignedInHubEvent = async () => {
    try {
        core_1.Hub.dispatch('auth', {
            event: 'signedIn',
            data: await (0, getCurrentUser_1.getCurrentUser)(),
        }, 'Auth', utils_1.AMPLIFY_SYMBOL);
    }
    catch (error) {
        if (error.name === constants_1.USER_UNAUTHENTICATED_EXCEPTION) {
            throw new AuthError_1.AuthError({
                name: constants_1.UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION,
                message: exports.ERROR_MESSAGE,
                recoverySuggestion: 'This most likely is due to auth tokens not being persisted. If you are using cookie store, please ensure cookies can be correctly set from your server.',
            });
        }
        throw error;
    }
};
exports.dispatchSignedInHubEvent = dispatchSignedInHubEvent;
//# sourceMappingURL=dispatchSignedInHubEvent.js.map
