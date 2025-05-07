import { Amplify } from '@aws-amplify/core';
import { listWebAuthnCredentials as listWebAuthnCredentials$1 } from '../../foundation/apis/listWebAuthnCredentials.mjs';
import '@aws-amplify/core/internals/utils';
import '../../providers/cognito/utils/types.mjs';
import '@aws-amplify/core/internals/aws-client-utils';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../common/AuthErrorStrings.mjs';
import '../../errors/types/validation.mjs';
import '../../providers/cognito/types/errors.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Lists registered credentials for an authenticated user
 *
 * @param {ListWebAuthnCredentialsInput} input The list input parameters including page size and next token.
 * @returns Promise<ListWebAuthnCredentialsOutput>
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link ListWebAuthnCredentialsException}
 * - Thrown due to a service error when listing WebAuthn credentials
 */
async function listWebAuthnCredentials(input) {
    return listWebAuthnCredentials$1(Amplify, input);
}

export { listWebAuthnCredentials };
//# sourceMappingURL=listWebAuthnCredentials.mjs.map
