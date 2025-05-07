import '@aws-amplify/core/internals/aws-client-utils/composers';
import '@aws-amplify/core/internals/aws-client-utils';
import '@aws-amplify/core/internals/utils';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/shared/handler/cognitoUserPoolTransferHandler.mjs';
import '../../../foundation/factories/serviceClients/cognitoIdentityProvider/constants.mjs';
import '../../../common/AuthErrorStrings.mjs';
import '../../../errors/types/validation.mjs';
import '../types/errors.mjs';
import { createRespondToAuthChallengeClient } from '../../../foundation/factories/serviceClients/cognitoIdentityProvider/createRespondToAuthChallengeClient.mjs';
import { createCognitoUserPoolEndpointResolver } from '../factories/createCognitoUserPoolEndpointResolver.mjs';
import { getRegionFromUserPoolId } from '../../../foundation/parsers/regionParsers.mjs';
import { assertDeviceMetadata } from './types.mjs';
import { getAuthenticationHelper } from './srp/getAuthenticationHelper.mjs';
import './srp/constants.mjs';
import { getNowString } from './srp/getNowString.mjs';
import { getSignatureString } from './srp/getSignatureString.mjs';
import BigInteger from './srp/BigInteger/BigInteger.mjs';
import { getUserContextData } from './userContextData.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function handleDeviceSRPAuth({ username, config, clientMetadata, session, tokenOrchestrator, }) {
    const { userPoolId, userPoolEndpoint } = config;
    const clientId = config.userPoolClientId;
    const deviceMetadata = await tokenOrchestrator?.getDeviceMetadata(username);
    assertDeviceMetadata(deviceMetadata);
    const authenticationHelper = await getAuthenticationHelper(deviceMetadata.deviceGroupKey);
    const challengeResponses = {
        USERNAME: username,
        SRP_A: authenticationHelper.A.toString(16),
        DEVICE_KEY: deviceMetadata.deviceKey,
    };
    const jsonReqResponseChallenge = {
        ChallengeName: 'DEVICE_SRP_AUTH',
        ClientId: clientId,
        ChallengeResponses: challengeResponses,
        ClientMetadata: clientMetadata,
        Session: session,
    };
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const { ChallengeParameters: respondedChallengeParameters, Session } = await respondToAuthChallenge({ region: getRegionFromUserPoolId(userPoolId) }, jsonReqResponseChallenge);
    return handleDevicePasswordVerifier(username, respondedChallengeParameters, clientMetadata, Session, authenticationHelper, config, tokenOrchestrator);
}
async function handleDevicePasswordVerifier(username, challengeParameters, clientMetadata, session, authenticationHelper, { userPoolId, userPoolClientId, userPoolEndpoint }, tokenOrchestrator) {
    const deviceMetadata = await tokenOrchestrator?.getDeviceMetadata(username);
    assertDeviceMetadata(deviceMetadata);
    const serverBValue = new BigInteger(challengeParameters?.SRP_B, 16);
    const salt = new BigInteger(challengeParameters?.SALT, 16);
    const { deviceKey } = deviceMetadata;
    const { deviceGroupKey } = deviceMetadata;
    const hkdf = await authenticationHelper.getPasswordAuthenticationKey({
        username: deviceMetadata.deviceKey,
        password: deviceMetadata.randomPassword,
        serverBValue,
        salt,
    });
    const dateNow = getNowString();
    const challengeResponses = {
        USERNAME: challengeParameters?.USERNAME ?? username,
        PASSWORD_CLAIM_SECRET_BLOCK: challengeParameters?.SECRET_BLOCK,
        TIMESTAMP: dateNow,
        PASSWORD_CLAIM_SIGNATURE: getSignatureString({
            username: deviceKey,
            userPoolName: deviceGroupKey,
            challengeParameters,
            dateNow,
            hkdf,
        }),
        DEVICE_KEY: deviceKey,
    };
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReqResponseChallenge = {
        ChallengeName: 'DEVICE_PASSWORD_VERIFIER',
        ClientId: userPoolClientId,
        ChallengeResponses: challengeResponses,
        Session: session,
        ClientMetadata: clientMetadata,
        UserContextData,
    };
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    return respondToAuthChallenge({ region: getRegionFromUserPoolId(userPoolId) }, jsonReqResponseChallenge);
}

export { handleDeviceSRPAuth };
//# sourceMappingURL=handleDeviceSRPAuth.mjs.map
