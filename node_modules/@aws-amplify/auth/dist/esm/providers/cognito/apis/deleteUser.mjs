import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokens } from '../utils/types.mjs';
import '../utils/refreshAuthTokens.mjs';
import '../tokenProvider/errorHelpers.mjs';
import { tokenOrchestrator } from '../tokenProvider/tokenProvider.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createDeleteUserClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createDeleteUserClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';
import { signOut } from './signOut.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Deletes a user from the user pool while authenticated.
 *
 * @throws - {@link DeleteUserException}
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function deleteUser() {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession();
    assertAuthTokens(tokens);
    const serviceDeleteUser = createDeleteUserClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await serviceDeleteUser({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.DeleteUser),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    await tokenOrchestrator.clearDeviceMetadata();
    await signOut();
}

export { deleteUser };
//# sourceMappingURL=deleteUser.mjs.map
