import { HubInternal } from '@aws-amplify/core/internals/utils';
import { signIn } from '../apis/signIn.mjs';
import { AuthError } from '../../../errors/AuthError.mjs';
import { setAutoSignIn, resetAutoSignIn } from '../apis/autoSignIn.mjs';
import { AUTO_SIGN_IN_EXCEPTION } from '../../../errors/constants.mjs';
import { signInWithUserAuth } from '../apis/signInWithUserAuth.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const MAX_AUTOSIGNIN_POLLING_MS = 3 * 60 * 1000;
function handleCodeAutoSignIn(signInInput) {
    const stopHubListener = HubInternal.listen('auth-internal', async ({ payload }) => {
        switch (payload.event) {
            case 'confirmSignUp': {
                const response = payload.data;
                if (response?.isSignUpComplete) {
                    HubInternal.dispatch('auth-internal', {
                        event: 'autoSignIn',
                    });
                    setAutoSignIn(autoSignInWithCode(signInInput));
                    stopHubListener();
                }
            }
        }
    });
    // This will stop the listener if confirmSignUp is not resolved.
    const timeOutId = setTimeout(() => {
        stopHubListener();
        clearTimeout(timeOutId);
        resetAutoSignIn();
    }, MAX_AUTOSIGNIN_POLLING_MS);
}
function debounce(fun, delay) {
    let timer;
    return (args) => {
        if (!timer) {
            fun(...args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, delay);
    };
}
function handleAutoSignInWithLink(signInInput, resolve, reject) {
    const start = Date.now();
    const autoSignInPollingIntervalId = setInterval(async () => {
        const elapsedTime = Date.now() - start;
        const maxTime = MAX_AUTOSIGNIN_POLLING_MS;
        if (elapsedTime > maxTime) {
            clearInterval(autoSignInPollingIntervalId);
            reject(new AuthError({
                name: AUTO_SIGN_IN_EXCEPTION,
                message: 'The account was not confirmed on time.',
                recoverySuggestion: 'Try to verify your account by clicking the link sent your email or phone and then login manually.',
            }));
            resetAutoSignIn();
        }
        else {
            try {
                const signInOutput = await signIn(signInInput);
                if (signInOutput.nextStep.signInStep !== 'CONFIRM_SIGN_UP') {
                    resolve(signInOutput);
                    clearInterval(autoSignInPollingIntervalId);
                    resetAutoSignIn();
                }
            }
            catch (error) {
                clearInterval(autoSignInPollingIntervalId);
                reject(error);
                resetAutoSignIn();
            }
        }
    }, 5000);
}
const debouncedAutoSignInWithLink = debounce(handleAutoSignInWithLink, 300);
const debouncedAutoSignWithCodeOrUserConfirmed = debounce(handleAutoSignInWithCodeOrUserConfirmed, 300);
function autoSignInWhenUserIsConfirmedWithLink(signInInput) {
    return async () => {
        return new Promise((resolve, reject) => {
            debouncedAutoSignInWithLink([signInInput, resolve, reject]);
        });
    };
}
async function handleAutoSignInWithCodeOrUserConfirmed(signInInput, resolve, reject) {
    try {
        const output = signInInput?.options?.authFlowType === 'USER_AUTH'
            ? await signInWithUserAuth(signInInput)
            : await signIn(signInInput);
        resolve(output);
        resetAutoSignIn();
    }
    catch (error) {
        reject(error);
        resetAutoSignIn();
    }
}
function autoSignInWithCode(signInInput) {
    return async () => {
        return new Promise((resolve, reject) => {
            debouncedAutoSignWithCodeOrUserConfirmed([signInInput, resolve, reject]);
        });
    };
}
const autoSignInUserConfirmed = autoSignInWithCode;

export { autoSignInUserConfirmed, autoSignInWhenUserIsConfirmedWithLink, handleCodeAutoSignIn };
//# sourceMappingURL=signUpHelpers.mjs.map
