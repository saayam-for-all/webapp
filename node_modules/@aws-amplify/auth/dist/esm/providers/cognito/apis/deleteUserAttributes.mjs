import { Amplify, fetchAuthSession } from '@aws-amplify/core';
import { assertTokenProviderConfig, AuthAction } from '@aws-amplify/core/internals/utils';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokens } from '../utils/types.mjs';
import { getAuthUserAgentValue } from '../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createDeleteUserAttributesClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createDeleteUserAttributesClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Deletes user attributes.
 *
 * @param input -  The DeleteUserAttributesInput object
 * @throws  -{@link DeleteUserAttributesException } - Thrown due to invalid attribute.
 * @throws AuthTokenConfigException - Thrown when the token provider config is invalid.
 */
async function deleteUserAttributes(input) {
    const authConfig = Amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userAttributeKeys } = input;
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession({ forceRefresh: false });
    assertAuthTokens(tokens);
    const deleteUserAttributesClient = createDeleteUserAttributesClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await deleteUserAttributesClient({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.DeleteUserAttributes),
    }, {
        AccessToken: tokens.accessToken.toString(),
        UserAttributeNames: userAttributeKeys,
    });
}

export { deleteUserAttributes };
//# sourceMappingURL=deleteUserAttributes.mjs.map
