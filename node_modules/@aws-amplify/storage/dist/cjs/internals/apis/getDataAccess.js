'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataAccess = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const userAgent_1 = require("../../providers/s3/utils/userAgent");
const s3control_1 = require("../../providers/s3/utils/client/s3control");
const StorageError_1 = require("../../errors/StorageError");
const utils_2 = require("../../utils");
const constants_1 = require("../utils/constants");
/**
 * @internal
 */
const getDataAccess = async (input) => {
    const targetType = input.scope.endsWith('*') ? undefined : 'Object';
    const clientCredentialsProvider = async (options) => {
        const { credentials } = await input.credentialsProvider(options);
        return credentials;
    };
    const result = await (0, s3control_1.getDataAccess)({
        credentials: clientCredentialsProvider,
        customEndpoint: input.customEndpoint,
        region: input.region,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.GetDataAccess),
    }, {
        AccountId: input.accountId,
        Target: input.scope,
        Permission: input.permission,
        TargetType: targetType,
        DurationSeconds: constants_1.DEFAULT_CRED_TTL,
    });
    const grantCredentials = result.Credentials;
    // Ensure that S3 returned credentials (this shouldn't happen)
    if (!grantCredentials ||
        !grantCredentials.AccessKeyId ||
        !grantCredentials.SecretAccessKey ||
        !grantCredentials.SessionToken ||
        !grantCredentials.Expiration) {
        throw new StorageError_1.StorageError({
            name: utils_1.AmplifyErrorCode.Unknown,
            message: 'Service did not return valid temporary credentials.',
        });
    }
    else {
        utils_2.logger.debug(`Retrieved credentials for: ${result.MatchedGrantTarget}`);
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
exports.getDataAccess = getDataAccess;
//# sourceMappingURL=getDataAccess.js.map
