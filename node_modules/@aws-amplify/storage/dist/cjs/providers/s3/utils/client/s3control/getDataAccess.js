'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataAccess = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../utils");
const base_1 = require("./base");
const getDataAccessSerializer = (input, endpoint) => {
    const headers = (0, utils_2.assignStringVariables)({
        'x-amz-account-id': input.AccountId,
    });
    const query = (0, utils_2.assignStringVariables)({
        durationSeconds: input.DurationSeconds,
        permission: input.Permission,
        privilege: input.Privilege,
        target: input.Target,
        targetType: input.TargetType,
    });
    const url = new utils_1.AmplifyUrl(endpoint.url.toString());
    url.search = new utils_1.AmplifyUrlSearchParams(query).toString();
    // Ref: https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_GetDataAccess.html
    url.pathname = '/v20180820/accessgrantsinstance/dataaccess';
    return {
        method: 'GET',
        headers,
        url,
    };
};
const getDataAccessDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        // error is always set when statusCode >= 300
        const error = (await (0, base_1.parseXmlError)(response));
        throw (0, utils_2.buildStorageServiceError)(error, response.statusCode);
    }
    else {
        const parsed = await (0, utils_2.parseXmlBody)(response);
        const contents = (0, utils_2.map)(parsed, {
            Credentials: ['Credentials', deserializeCredentials],
            MatchedGrantTarget: 'MatchedGrantTarget',
        });
        return {
            $metadata: (0, aws_client_utils_1.parseMetadata)(response),
            ...contents,
        };
    }
};
const deserializeCredentials = (output) => (0, utils_2.map)(output, {
    AccessKeyId: 'AccessKeyId',
    Expiration: ['Expiration', utils_2.deserializeTimestamp],
    SecretAccessKey: 'SecretAccessKey',
    SessionToken: 'SessionToken',
});
exports.getDataAccess = (0, composers_1.composeServiceApi)(utils_2.s3TransferHandler, getDataAccessSerializer, getDataAccessDeserializer, { ...base_1.defaultConfig, responseType: 'text' });
//# sourceMappingURL=getDataAccess.js.map
