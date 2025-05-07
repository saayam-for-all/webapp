import { Hub } from '@aws-amplify/core';
import { AMPLIFY_SYMBOL } from '@aws-amplify/core/internals/utils';
import { getCurrentUser } from '../apis/getCurrentUser.mjs';
import { USER_UNAUTHENTICATED_EXCEPTION, UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION } from '../../../errors/constants.mjs';
import { AuthError } from '../../../errors/AuthError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const ERROR_MESSAGE = 'Unable to get user session following successful sign-in.';
const dispatchSignedInHubEvent = async () => {
    try {
        Hub.dispatch('auth', {
            event: 'signedIn',
            data: await getCurrentUser(),
        }, 'Auth', AMPLIFY_SYMBOL);
    }
    catch (error) {
        if (error.name === USER_UNAUTHENTICATED_EXCEPTION) {
            throw new AuthError({
                name: UNEXPECTED_SIGN_IN_INTERRUPTION_EXCEPTION,
                message: ERROR_MESSAGE,
                recoverySuggestion: 'This most likely is due to auth tokens not being persisted. If you are using cookie store, please ensure cookies can be correctly set from your server.',
            });
        }
        throw error;
    }
};

export { ERROR_MESSAGE, dispatchSignedInHubEvent };
//# sourceMappingURL=dispatchSignedInHubEvent.mjs.map
