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
import { createListWebAuthnCredentialsClient } from '../factories/serviceClients/cognitoIdentityProvider/createListWebAuthnCredentialsClient.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function listWebAuthnCredentials(amplify, input) {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await amplify.Auth.fetchAuthSession();
    assertAuthTokens(tokens);
    const listWebAuthnCredentialsResult = createListWebAuthnCredentialsClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { Credentials: commandCredentials = [], NextToken: nextToken } = await listWebAuthnCredentialsResult({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.ListWebAuthnCredentials),
    }, {
        AccessToken: tokens.accessToken.toString(),
        MaxResults: input?.pageSize,
        NextToken: input?.nextToken,
    });
    const credentials = commandCredentials.map(item => ({
        credentialId: item.CredentialId,
        friendlyCredentialName: item.FriendlyCredentialName,
        relyingPartyId: item.RelyingPartyId,
        authenticatorAttachment: item.AuthenticatorAttachment,
        authenticatorTransports: item.AuthenticatorTransports,
        createdAt: item.CreatedAt ? new Date(item.CreatedAt * 1000) : undefined,
    }));
    return {
        credentials,
        nextToken,
    };
}

export { listWebAuthnCredentials };
//# sourceMappingURL=listWebAuthnCredentials.mjs.map
