import { parseMetadata } from '@aws-amplify/core/internals/aws-client-utils';
import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { AmplifyUrl, AmplifyUrlSearchParams } from '@aws-amplify/core/internals/utils';
import { parseXmlBody } from '../utils/parsePayload.mjs';
import { s3TransferHandler } from '../runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import { buildStorageServiceError, map, deserializeTimestamp } from '../utils/deserializeHelpers.mjs';
import { assignStringVariables } from '../utils/serializeHelpers.mjs';
import { defaultConfig, parseXmlError } from './base.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getDataAccessSerializer = (input, endpoint) => {
    const headers = assignStringVariables({
        'x-amz-account-id': input.AccountId,
    });
    const query = assignStringVariables({
        durationSeconds: input.DurationSeconds,
        permission: input.Permission,
        privilege: input.Privilege,
        target: input.Target,
        targetType: input.TargetType,
    });
    const url = new AmplifyUrl(endpoint.url.toString());
    url.search = new AmplifyUrlSearchParams(query).toString();
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
        const error = (await parseXmlError(response));
        throw buildStorageServiceError(error, response.statusCode);
    }
    else {
        const parsed = await parseXmlBody(response);
        const contents = map(parsed, {
            Credentials: ['Credentials', deserializeCredentials],
            MatchedGrantTarget: 'MatchedGrantTarget',
        });
        return {
            $metadata: parseMetadata(response),
            ...contents,
        };
    }
};
const deserializeCredentials = (output) => map(output, {
    AccessKeyId: 'AccessKeyId',
    Expiration: ['Expiration', deserializeTimestamp],
    SecretAccessKey: 'SecretAccessKey',
    SessionToken: 'SessionToken',
});
const getDataAccess = composeServiceApi(s3TransferHandler, getDataAccessSerializer, getDataAccessDeserializer, { ...defaultConfig, responseType: 'text' });

export { getDataAccess };
//# sourceMappingURL=getDataAccess.mjs.map
