import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { assertAuthTokens } from '../../providers/cognito/utils/types.mjs';
import { createCognitoUserPoolEndpointResolver } from '../../providers/cognito/factories/createCognitoUserPoolEndpointResolver.mjs';
import { getRegionFromUserPoolId } from '../parsers/regionParsers.mjs';
import { getAuthUserAgentValue } from '../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../common/AuthErrorStrings.mjs';
import '../../errors/types/validation.mjs';
import '../../providers/cognito/types/errors.mjs';
import { createDeleteWebAuthnCredentialClient } from '../factories/serviceClients/cognitoIdentityProvider/createDeleteWebAuthnCredentialClient.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function deleteWebAuthnCredential(amplify, input) {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await amplify.Auth.fetchAuthSession();
    assertAuthTokens(tokens);
    const deleteWebAuthnCredentialResult = createDeleteWebAuthnCredentialClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await deleteWebAuthnCredentialResult({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.DeleteWebAuthnCredential),
    }, {
        AccessToken: tokens.accessToken.toString(),
        CredentialId: input.credentialId,
    });
}

export { deleteWebAuthnCredential };
//# sourceMappingURL=deleteWebAuthnCredential.mjs.map
