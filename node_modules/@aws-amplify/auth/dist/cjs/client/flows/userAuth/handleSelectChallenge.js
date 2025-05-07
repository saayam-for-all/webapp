'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiateSelectedChallenge = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const cognitoIdentityProvider_1 = require("../../../foundation/factories/serviceClients/cognitoIdentityProvider");
const factories_1 = require("../../../providers/cognito/factories");
const parsers_1 = require("../../../foundation/parsers");
const utils_2 = require("../../../utils");
/**
 * Handles the SELECT_CHALLENGE response for authentication.
 * Initiates the selected authentication challenge based on user choice.
 *
 * @param {Object} params - The parameters for handling the selected challenge
 * @param {string} params.username - The username for authentication
 * @param {string} params.session - The current authentication session token
 * @param {string} params.selectedChallenge - The challenge type selected by the user
 * @param {CognitoUserPoolConfig} params.config - Cognito User Pool configuration
 * @param {ClientMetadata} [params.clientMetadata] - Optional metadata to be sent with auth requests
 *
 * @returns {Promise<RespondToAuthChallengeCommandOutput>} The challenge response
 */
async function initiateSelectedChallenge({ username, session, selectedChallenge, config, clientMetadata, }) {
    const respondToAuthChallenge = (0, cognitoIdentityProvider_1.createRespondToAuthChallengeClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: config.userPoolEndpoint,
        }),
    });
    return respondToAuthChallenge({
        region: (0, parsers_1.getRegionFromUserPoolId)(config.userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.ConfirmSignIn),
    }, {
        ChallengeName: 'SELECT_CHALLENGE',
        ChallengeResponses: {
            USERNAME: username,
            ANSWER: selectedChallenge,
        },
        ClientId: config.userPoolClientId,
        Session: session,
        ClientMetadata: clientMetadata,
    });
}
exports.initiateSelectedChallenge = initiateSelectedChallenge;
//# sourceMappingURL=handleSelectChallenge.js.map
