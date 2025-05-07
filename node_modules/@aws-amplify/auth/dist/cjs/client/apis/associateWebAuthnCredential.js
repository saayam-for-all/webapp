'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.associateWebAuthnCredential = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const types_1 = require("../../providers/cognito/utils/types");
const factories_1 = require("../../providers/cognito/factories");
const parsers_1 = require("../../foundation/parsers");
const utils_2 = require("../../utils");
const utils_3 = require("../utils");
const cognitoIdentityProvider_1 = require("../../foundation/factories/serviceClients/cognitoIdentityProvider");
const types_2 = require("../utils/passkey/types");
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
    const authConfig = core_1.Amplify.getConfig().Auth?.Cognito;
    (0, utils_1.assertTokenProviderConfig)(authConfig);
    const { userPoolEndpoint, userPoolId } = authConfig;
    const { tokens } = await (0, core_1.fetchAuthSession)();
    (0, types_1.assertAuthTokens)(tokens);
    const startWebAuthnRegistration = (0, cognitoIdentityProvider_1.createStartWebAuthnRegistrationClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { CredentialCreationOptions: credentialCreationOptions } = await startWebAuthnRegistration({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.StartWebAuthnRegistration),
    }, {
        AccessToken: tokens.accessToken.toString(),
    });
    (0, types_2.assertValidCredentialCreationOptions)(credentialCreationOptions);
    const cred = await (0, utils_3.registerPasskey)(credentialCreationOptions);
    const completeWebAuthnRegistration = (0, cognitoIdentityProvider_1.createCompleteWebAuthnRegistrationClient)({
        endpointResolver: (0, factories_1.createCognitoUserPoolEndpointResolver)({
            endpointOverride: userPoolEndpoint,
        }),
    });
    await completeWebAuthnRegistration({
        region: (0, parsers_1.getRegionFromUserPoolId)(userPoolId),
        userAgentValue: (0, utils_2.getAuthUserAgentValue)(utils_1.AuthAction.CompleteWebAuthnRegistration),
    }, {
        AccessToken: tokens.accessToken.toString(),
        Credential: cred,
    });
}
exports.associateWebAuthnCredential = associateWebAuthnCredential;
//# sourceMappingURL=associateWebAuthnCredential.js.map
