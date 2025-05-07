'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoSignInUserConfirmed = exports.autoSignInWhenUserIsConfirmedWithLink = exports.handleCodeAutoSignIn = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const signIn_1 = require("../apis/signIn");
const AuthError_1 = require("../../../errors/AuthError");
const autoSignIn_1 = require("../apis/autoSignIn");
const constants_1 = require("../../../errors/constants");
const signInWithUserAuth_1 = require("../apis/signInWithUserAuth");
const MAX_AUTOSIGNIN_POLLING_MS = 3 * 60 * 1000;
function handleCodeAutoSignIn(signInInput) {
    const stopHubListener = utils_1.HubInternal.listen('auth-internal', async ({ payload }) => {
        switch (payload.event) {
            case 'confirmSignUp': {
                const response = payload.data;
                if (response?.isSignUpComplete) {
                    utils_1.HubInternal.dispatch('auth-internal', {
                        event: 'autoSignIn',
                    });
                    (0, autoSignIn_1.setAutoSignIn)(autoSignInWithCode(signInInput));
                    stopHubListener();
                }
            }
        }
    });
    // This will stop the listener if confirmSignUp is not resolved.
    const timeOutId = setTimeout(() => {
        stopHubListener();
        clearTimeout(timeOutId);
        (0, autoSignIn_1.resetAutoSignIn)();
    }, MAX_AUTOSIGNIN_POLLING_MS);
}
exports.handleCodeAutoSignIn = handleCodeAutoSignIn;
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
            reject(new AuthError_1.AuthError({
                name: constants_1.AUTO_SIGN_IN_EXCEPTION,
                message: 'The account was not confirmed on time.',
                recoverySuggestion: 'Try to verify your account by clicking the link sent your email or phone and then login manually.',
            }));
            (0, autoSignIn_1.resetAutoSignIn)();
        }
        else {
            try {
                const signInOutput = await (0, signIn_1.signIn)(signInInput);
                if (signInOutput.nextStep.signInStep !== 'CONFIRM_SIGN_UP') {
                    resolve(signInOutput);
                    clearInterval(autoSignInPollingIntervalId);
                    (0, autoSignIn_1.resetAutoSignIn)();
                }
            }
            catch (error) {
                clearInterval(autoSignInPollingIntervalId);
                reject(error);
                (0, autoSignIn_1.resetAutoSignIn)();
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
exports.autoSignInWhenUserIsConfirmedWithLink = autoSignInWhenUserIsConfirmedWithLink;
async function handleAutoSignInWithCodeOrUserConfirmed(signInInput, resolve, reject) {
    try {
        const output = signInInput?.options?.authFlowType === 'USER_AUTH'
            ? await (0, signInWithUserAuth_1.signInWithUserAuth)(signInInput)
            : await (0, signIn_1.signIn)(signInInput);
        resolve(output);
        (0, autoSignIn_1.resetAutoSignIn)();
    }
    catch (error) {
        reject(error);
        (0, autoSignIn_1.resetAutoSignIn)();
    }
}
function autoSignInWithCode(signInInput) {
    return async () => {
        return new Promise((resolve, reject) => {
            debouncedAutoSignWithCodeOrUserConfirmed([signInInput, resolve, reject]);
        });
    };
}
exports.autoSignInUserConfirmed = autoSignInWithCode;
//# sourceMappingURL=signUpHelpers.js.map
