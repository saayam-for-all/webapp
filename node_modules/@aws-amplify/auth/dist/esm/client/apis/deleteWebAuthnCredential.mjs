import { Amplify } from '@aws-amplify/core';
import '@aws-amplify/core/internals/utils';
import '../../providers/cognito/utils/types.mjs';
import '@aws-amplify/core/internals/aws-client-utils';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../common/AuthErrorStrings.mjs';
import '../../errors/types/validation.mjs';
import '../../providers/cognito/types/errors.mjs';
import { deleteWebAuthnCredential as deleteWebAuthnCredential$1 } from '../../foundation/apis/deleteWebAuthnCredential.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Delete a registered credential for an authenticated user by credentialId
 * @param {DeleteWebAuthnCredentialInput} input The delete input parameters including the credentialId
 * @returns Promise<void>
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link DeleteWebAuthnCredentialException}
 * - Thrown due to a service error when deleting a WebAuthn credential
 */
async function deleteWebAuthnCredential(input) {
    return deleteWebAuthnCredential$1(Amplify, input);
}

export { deleteWebAuthnCredential };
//# sourceMappingURL=deleteWebAuthnCredential.mjs.map
