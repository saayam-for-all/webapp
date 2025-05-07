'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserAttributes = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const parsers_1 = require("../../../../foundation/parsers");
const types_1 = require("../../utils/types");
const apiHelpers_1 = require("../../utils/apiHelpers");
const utils_2 = require("../../../../utils");
const cognitoIdentityProvider_1 = require("../../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../../factories");
const fetchUserAttributes = async (amplify) => {
    const authConfig = amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, utils_1.fetchAuthSession)(amplify, {
        forceRefresh: false,
    });
    (0, types_1.assertAuthTokens)(tokens);
    const getUser = (0, cognitoIdentityProvider_1.createGetUserClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { UserAttributes } = await getUser({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.FetchUserAttributes),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    return (0, apiHelpers_1.toAuthUserAttribute)(UserAttributes);
};
exports.fetchUserAttributes = fetchUserAttributes;
//# sourceMappingURL=fetchUserAttributes.js.map
