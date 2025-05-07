import { assertTokenProviderConfig, fetchAuthSession, AuthAction } from '@aws-amplify/core/internals/utils';
import { getRegionFromUserPoolId } from '../../../../foundation/parsers/regionParsers.mjs';
import { assertAuthTokens } from '../../utils/types.mjs';
import { toAuthUserAttribute } from '../../utils/apiHelpers.mjs';
import { getAuthUserAgentValue } from '../../../../utils/getAuthUserAgentValue.mjs';
import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../../common/AuthErrorStrings.mjs';
import '../../../../errors/types/validation.mjs';
import '../../types/errors.mjs';
import { createGetUserClient } from '../../../../foundation/factories/serviceClients/cognitoIdentityProvider/createGetUserClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../../factories/createCognitoUserPoolEndpointResolver.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fetchUserAttributes = async (amplify) => {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    assertTokenProviderConfig(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await fetchAuthSession(amplify, {
        forceRefresh: false,
    });
    assertAuthTokens(tokens);
    const getUser = createGetUserClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { UserAttributes } = await getUser({
        region: getRegionFromUserPoolId(userPoolId),
        userAgentValue: getAuthUserAgentValue(AuthAction.FetchUserAttributes),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    return toAuthUserAttribute(UserAttributes);
};

export { fetchUserAttributes };
//# sourceMappingURL=fetchUserAttributes.mjs.map
