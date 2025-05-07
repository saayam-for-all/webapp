import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { assertAuthTokens } from '../../providers/cognito/utils/types.mjs';
import { createCognitoUserPoolEndpointResolver } from '../../providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs';
import { getRegionFromUserPoolId } from '../../foundation/parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../utils/getAuthUserAgentValue.mjs';
import { registerPasskey } from '../utils/passkey/registerPasskey.mjs';
import '../utils/passkey/errors.mjs';
import { assertValidCredentialCreationOptions } from '../utils/passkey/types/shared.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../common/AuthErrorStrings.mjs';
import '../../errors/types/validation.mjs';
import '../../providers/cognito/types/errors.mjs';
import { createStartWebAuthnRegistrationClient } from '../../foundation/factories/serviceClients/cognitoIdentityProvider/createStartWebAuthnRegistrationClient.mjs';
import { createCompleteWebAuthnRegistrationClient } from '../../foundation/factories/serviceClients/cognitoIdentityProvider/createCompleteWebAuthnRegistrationClient.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Registers a new passkey for an authenticated user
 *
 * @returns Promise<void>
 * @throws - {@link PasskeyError}:
 * - Thrown when intermediate state is invalid
 * @throws - {@link AuthError}:
 * - Thrown when user is unauthenticated
 * @throws - {@link StartWebAuthnRegistrationException}
 * - Thrown due to a service error retrieving WebAuthn registration options
 * @throws - {@link CompleteWebAuthnRegistrationException}
 * - Thrown due to a service error when verifying WebAuthn registration result
 */
async function associateWebAuthnCredential() {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession();
    assertAuthTokens(tokens);
    const startWebAuthnRegistration = createStartWebAuthnRegistrationClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CredentialCreationOptions: credentialCreationOptions } = await startWebAuthnRegistration({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.StartWebAuthnRegistration),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    assertValidCredentialCreationOptions(credentialCreationOptions);
    const cred = await registerPasskey(credentialCreationOptions);
    const completeWebAuthnRegistration = createCompleteWebAuthnRegistrationClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await completeWebAuthnRegistration({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.CompleteWebAuthnRegistration),
    }, {
        AccessToken: tokens.accessToken.toString(),
        Credential: cred,
    });
}

export { associateWebAuthnCredential };
//# sourceMappingURL=associateWebAuthnCredential.mjs.map
