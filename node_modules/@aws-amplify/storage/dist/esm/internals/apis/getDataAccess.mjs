import { StorageAction, AmplifyErrorCode } from '@aws-amplify/core/internals/utils';
import { getStorageUserAgentValue } from '../../providers/s3/utils/userAgent.mjs';
import { getDataAccess as getDataAccess$1 } from '../../providers/s3/utils/client/s3control/getDataAccess.mjs';
import '../../providers/s3/utils/client/s3control/listCallerAccessGrants.mjs';
import { StorageError } from '../../errors/StorageError.mjs';
import '../../errors/types/validation.mjs';
import { logger } from '../../utils/logger.mjs';
import { DEFAULT_CRED_TTL } from '../utils/constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
const getDataAccess = async (input) => {
    const targetType = input.scope.endsWith('*') ? undefined : 'Object';
    const clientCredentialsProvider = async (options) => {
        const { credentials } = await input.credentialsProvider(options);
        return credentials;
    };
    const result = await getDataAccess$1({
        credentials: clientCredentialsProvider,
        customEndpoint: input.customEndpoint,
        region: input.region,
        userAgentValue: getStorageUserAgentValue(StorageAction.GetDataAccess),
    }, {
        AccountId: input.accountId,
        Target: input.scope,
        Permission: input.permission,
        TargetType: targetType,
        DurationSeconds: DEFAULT_CRED_TTL,
    });
    const grantCredentials = result.Credentials;
    // Ensure that S3 returned credentials (this shouldn't happen)
    if (!grantCredentials ||
        !grantCredentials.AccessKeyId ||
        !grantCredentials.SecretAccessKey ||
        !grantCredentials.SessionToken ||
        !grantCredentials.Expiration) {
        throw new StorageError({
            name: AmplifyErrorCode.Unknown,
            message: 'Service did not return valid temporary credentials.',
        });
    }
    else {
        logger.debug(`Retrieved credentials for: ${result.MatchedGrantTarget}`);
    }
    const { AccessKeyId: accessKeyId, SecretAccessKey: secretAccessKey, SessionToken: sessionToken, Expiration: expiration, } = grantCredentials;
    return {
        credentials: {
            accessKeyId,
            secretAccessKey,
            sessionToken,
            expiration,
        },
        scope: result.MatchedGrantTarget,
    };
};

export { getDataAccess };
//# sourceMappingURL=getDataAccess.mjs.map
