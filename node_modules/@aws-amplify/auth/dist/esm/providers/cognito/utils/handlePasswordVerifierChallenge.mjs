import { AuthError } from '../../../errors/AuthError.mjs';
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
import BigInteger from './srp/BigInteger/BigInteger.mjs';
import './srp/constants.mjs';
import '@aws-crypto/sha256-js';
import { getNowString } from './srp/getNowString.mjs';
import { getSignatureString } from './srp/getSignatureString.mjs';
import { getUserContextData } from './userContextData.mjs';
import { handleDeviceSRPAuth } from './handleDeviceSRPAuth.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function handlePasswordVerifierChallenge(password, challengeParameters, clientMetadata, session, authenticationHelper, config, tokenOrchestrator) {
    const { userPoolId, userPoolClientId, userPoolEndpoint } = config;
    const userPoolName = userPoolId?.split('_')[1] || '';
    const serverBValue = new BigInteger(challengeParameters?.SRP_B, 16);
    const salt = new BigInteger(challengeParameters?.SALT, 16);
    const username = challengeParameters?.USER_ID_FOR_SRP;
    if (!username)
        throw new AuthError({
            name: 'EmptyUserIdForSRPException',
            message: 'USER_ID_FOR_SRP was not found in challengeParameters',
        });
    const hkdf = await authenticationHelper.getPasswordAuthenticationKey({
        username,
        password,
        serverBValue,
        salt,
    });
    const dateNow = getNowString();
    const challengeResponses = {
        USERNAME: username,
        PASSWORD_CLAIM_SECRET_BLOCK: challengeParameters?.SECRET_BLOCK,
        TIMESTAMP: dateNow,
        PASSWORD_CLAIM_SIGNATURE: getSignatureString({
            username,
            userPoolName,
            challengeParameters,
            dateNow,
            hkdf,
        }),
    };
    const deviceMetadata = await tokenOrchestrator.getDeviceMetadata(username);
    if (deviceMetadata && deviceMetadata.deviceKey) {
        challengeResponses.DEVICE_KEY = deviceMetadata.deviceKey;
    }
    const UserContextData = getUserContextData({
        username,
        userPoolId,
        userPoolClientId,
    });
    const jsonReqResponseChallenge = {
        ChallengeName: 'PASSWORD_VERIFIER',
        ChallengeResponses: challengeResponses,
        ClientMetadata: clientMetadata,
        Session: session,
        ClientId: userPoolClientId,
        UserContextData,
    };
    const respondToAuthChallenge = createRespondToAuthChallengeClient({
        endpointResolver: createCognitoUserPoolEndpointResolver({
            endpointOverride: userPoolEndpoint,
        }),
    });
    const response = await respondToAuthChallenge({ region: getRegionFromUserPoolId(userPoolId) }, jsonReqResponseChallenge);
    if (response.ChallengeName === 'DEVICE_SRP_AUTH')
        return handleDeviceSRPAuth({
            username,
            config,
            clientMetadata,
            session: response.Session,
            tokenOrchestrator,
        });
    return response;
}

export { handlePasswordVerifierChallenge };
//# sourceMappingURL=handlePasswordVerifierChallenge.mjs.map
