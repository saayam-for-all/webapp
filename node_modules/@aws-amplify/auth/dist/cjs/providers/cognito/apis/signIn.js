'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const signInHelpers_1 = require("../utils/signInHelpers");
const signInWithCustomAuth_1 = require("./signInWithCustomAuth");
const signInWithCustomSRPAuth_1 = require("./signInWithCustomSRPAuth");
const signInWithSRP_1 = require("./signInWithSRP");
const signInWithUserPassword_1 = require("./signInWithUserPassword");
const signInWithUserAuth_1 = require("./signInWithUserAuth");
const autoSignIn_1 = require("./autoSignIn");
/**
 * Signs a user in
 *
 * @param input -  The SignInInput object
 * @returns SignInOutput
 * @throws service: {@link InitiateAuthException }, {@link RespondToAuthChallengeException }
 *  - Cognito service errors thrown during the sign-in process.
 * @throws validation: {@link AuthValidationErrorCode  } - Validation errors thrown when either username or password
 *  are not defined.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function signIn(input) {
    // Here we want to reset the store but not reassign the callback.
    // The callback is reset when the underlying promise resolves or rejects.
    // With the advent of session based sign in, this guarantees that the signIn API initiates a new auth flow,
    // regardless of whether it is called for a user currently engaged in an active auto sign in session.
    (0, autoSignIn_1.resetAutoSignIn)(false);
    const authFlowType = input.options?.authFlowType;
    await (0, signInHelpers_1.assertUserNotAuthenticated)();
    switch (authFlowType) {
        case 'USER_SRP_AUTH':
            return (0, signInWithSRP_1.signInWithSRP)(input);
        case 'USER_PASSWORD_AUTH':
            return (0, signInWithUserPassword_1.signInWithUserPassword)(input);
        case 'CUSTOM_WITHOUT_SRP':
            return (0, signInWithCustomAuth_1.signInWithCustomAuth)(input);
        case 'CUSTOM_WITH_SRP':
            return (0, signInWithCustomSRPAuth_1.signInWithCustomSRPAuth)(input);
        case 'USER_AUTH':
            return (0, signInWithUserAuth_1.signInWithUserAuth)(input);
        default:
            return (0, signInWithSRP_1.signInWithSRP)(input);
    }
}
exports.signIn = signIn;
//# sourceMappingURL=signIn.js.map
