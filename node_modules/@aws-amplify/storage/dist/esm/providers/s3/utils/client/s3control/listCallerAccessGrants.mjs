import { parseMetadata } from '@aws-amplify/core/internals/aws-client-utils';
import { AmplifyUrl, AmplifyUrlSearchParams } from '@aws-amplify/core/internals/utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { parseXmlBody } from '../utils/parsePayload.mjs';
import { s3TransferHandler } from '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { buildStorageServiceError, map, emptyArrayGuard, createStringEnumDeserializer } from '../utils/deserializeHelpers.mjs';
import { assignStringVariables } from '../utils/serializeHelpers.mjs';
import { defaultConfig, parseXmlError } from './base.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const listCallerAccessGrantsSerializer = (input, endpoint) => {
    const headers = assignStringVariables({
        'x-amz-account-id': input.AccountId,
    });
    const query = assignStringVariables({
        grantscope: input.GrantScope,
        maxResults: input.MaxResults,
        nextToken: input.NextToken,
        allowedByApplication: input.AllowedByApplication,
    });
    const url = new AmplifyUrl(endpoint.url.toString());
    url.search = new AmplifyUrlSearchParams(query).toString();
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
        const error = (await parseXmlError(response));
        throw buildStorageServiceError(error, response.statusCode);
    }
    else {
        const parsed = await parseXmlBody(response);
        const contents = map(parsed, {
            CallerAccessGrantsList: [
                'CallerAccessGrantsList',
                value => emptyArrayGuard(value.AccessGrant, deserializeAccessGrantsList),
            ],
            NextToken: 'NextToken',
        });
        return {
            $metadata: parseMetadata(response),
            ...contents,
        };
    }
};
const deserializeAccessGrantsList = (output) => output.map(deserializeCallerAccessGrant);
const deserializeCallerAccessGrant = (output) => map(output, {
    ApplicationArn: 'ApplicationArn',
    GrantScope: 'GrantScope',
    Permission: [
        'Permission',
        createStringEnumDeserializer(['READ', 'READWRITE', 'WRITE'], 'Permission'),
    ],
});
const listCallerAccessGrants = composeServiceApi(s3TransferHandler, listCallerAccessGrantsSerializer, listCallerAccessGrantsDeserializer, { ...defaultConfig, responseType: 'text' });

export { listCallerAccessGrants };
//# sourceMappingURL=listCallerAccessGrants.mjs.map
