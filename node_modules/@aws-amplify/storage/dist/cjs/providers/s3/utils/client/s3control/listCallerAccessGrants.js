'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCallerAccessGrants = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_1 = require("@aws-amplify/core/internals/utils");
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const utils_2 = require("../utils");
const deserializeHelpers_1 = require("../utils/deserializeHelpers");
const base_1 = require("./base");
const listCallerAccessGrantsSerializer = (input, endpoint) => {
    const headers = (0, utils_2.assignStringVariables)({
        'x-amz-account-id': input.AccountId,
    });
    const query = (0, utils_2.assignStringVariables)({
        grantscope: input.GrantScope,
        maxResults: input.MaxResults,
        nextToken: input.NextToken,
        allowedByApplication: input.AllowedByApplication,
    });
    const url = new utils_1.AmplifyUrl(endpoint.url.toString());
    url.search = new utils_1.AmplifyUrlSearchParams(query).toString();
    // Ref: https://docs.aws.amazon.com/AmazonS3/latest/API/API_control_ListCallerAccessGrants.html
    url.pathname = '/v20180820/accessgrantsinstance/caller/grants';
    return {
        method: 'GET',
        headers,
        url,
    };
};
const listCallerAccessGrantsDeserializer = async (response) => {
    if (response.statusCode >= 300) {
        // error is always set when statusCode >= 300
        const error = (await (0, base_1.parseXmlError)(response));
        throw (0, utils_2.buildStorageServiceError)(error, response.statusCode);
    }
    else {
        const parsed = await (0, utils_2.parseXmlBody)(response);
        const contents = (0, utils_2.map)(parsed, {
            CallerAccessGrantsList: [
                'CallerAccessGrantsList',
                value => (0, utils_2.emptyArrayGuard)(value.AccessGrant, deserializeAccessGrantsList),
            ],
            NextToken: 'NextToken',
        });
        return {
            $metadata: (0, aws_client_utils_1.parseMetadata)(response),
            ...contents,
        };
    }
};
const deserializeAccessGrantsList = (output) => output.map(deserializeCallerAccessGrant);
const deserializeCallerAccessGrant = (output) => (0, utils_2.map)(output, {
    ApplicationArn: 'ApplicationArn',
    GrantScope: 'GrantScope',
    Permission: [
        'Permission',
        (0, deserializeHelpers_1.createStringEnumDeserializer)(['READ', 'READWRITE', 'WRITE'], 'Permission'),
    ],
});
exports.listCallerAccessGrants = (0, composers_1.composeServiceApi)(utils_2.s3TransferHandler, listCallerAccessGrantsSerializer, listCallerAccessGrantsDeserializer, { ...base_1.defaultConfig, responseType: 'text' });
//# sourceMappingURL=listCallerAccessGrants.js.map
