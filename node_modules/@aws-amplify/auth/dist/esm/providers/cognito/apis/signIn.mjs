import { assertUserNotAuthenticated } from '../utils/signInHelpers.mjs';
import { signInWithCustomAuth } from './signInWithCustomAuth.mjs';
import { signInWithCustomSRPAuth } from './signInWithCustomSRPAuth.mjs';
import { signInWithSRP } from './signInWithSRP.mjs';
import { signInWithUserPassword } from './signInWithUserPassword.mjs';
import { signInWithUserAuth } from './signInWithUserAuth.mjs';
import { resetAutoSignIn } from './autoSignIn.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
    resetAutoSignIn(false);
    const authFlowType = input.options?.authFlowType;
    await assertUserNotAuthenticated();
    switch (authFlowType) {
        case 'USER_SRP_AUTH':
            return signInWithSRP(input);
        case 'USER_PASSWORD_AUTH':
            return signInWithUserPassword(input);
        case 'CUSTOM_WITHOUT_SRP':
            return signInWithCustomAuth(input);
        case 'CUSTOM_WITH_SRP':
            return signInWithCustomSRPAuth(input);
        case 'USER_AUTH':
            return signInWithUserAuth(input);
        default:
            return signInWithSRP(input);
    }
}

export { signIn };
//# sourceMappingURL=signIn.mjs.map
