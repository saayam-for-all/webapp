'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsRealTimeHeaderBasedAuth = void 0;
const core_1 = require("@aws-amplify/core");
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_1 = require("@aws-amplify/core/internals/utils");
const constants_1 = require("../constants");
const logger = new core_1.ConsoleLogger('AWSAppSyncRealTimeProvider Auth');
const awsAuthTokenHeader = async ({ host }) => {
    const session = await (0, core_1.fetchAuthSession)();
    return {
        Authorization: session?.tokens?.accessToken?.toString(),
        host,
    };
};
const awsRealTimeApiKeyHeader = async ({ apiKey, host, }) => {
    const dt = new Date();
    const dtStr = dt.toISOString().replace(/[:-]|\.\d{3}/g, '');
    return {
        host,
        'x-amz-date': dtStr,
        'x-api-key': apiKey,
    };
};
const awsRealTimeIAMHeader = async ({ payload, canonicalUri, appSyncGraphqlEndpoint, region, }) => {
    const endpointInfo = {
        region,
        service: 'appsync',
    };
    const creds = (await (0, core_1.fetchAuthSession)()).credentials;
    const request = {
        url: `${appSyncGraphqlEndpoint}${canonicalUri}`,
        data: payload,
        method: 'POST',
        headers: { ...constants_1.AWS_APPSYNC_REALTIME_HEADERS },
    };
    const signedParams = (0, aws_client_utils_1.signRequest)({
        headers: request.headers,
        method: request.method,
        url: new utils_1.AmplifyUrl(request.url),
        body: request.data,
    }, {
        credentials: creds,
        signingRegion: endpointInfo.region,
        signingService: endpointInfo.service,
    });
    return signedParams.headers;
};
const customAuthHeader = async ({ host, additionalCustomHeaders, }) => {
    /**
     * If `additionalHeaders` was provided to the subscription as a function,
     * the headers that are returned by that function will already have been
     * provided before this function is called.
     */
    if (!additionalCustomHeaders?.Authorization) {
        throw new Error('No auth token specified');
    }
    return {
        Authorization: additionalCustomHeaders.Authorization,
        host,
    };
};
const awsRealTimeHeaderBasedAuth = async ({ apiKey, authenticationType, canonicalUri, appSyncGraphqlEndpoint, region, additionalCustomHeaders, payload, }) => {
    const headerHandler = {
        apiKey: awsRealTimeApiKeyHeader,
        iam: awsRealTimeIAMHeader,
        oidc: awsAuthTokenHeader,
        userPool: awsAuthTokenHeader,
        lambda: customAuthHeader,
        none: customAuthHeader,
    };
    if (!authenticationType || !headerHandler[authenticationType]) {
        logger.debug(`Authentication type ${authenticationType} not supported`);
        return undefined;
    }
    else {
        const handler = headerHandler[authenticationType];
        const host = appSyncGraphqlEndpoint
            ? new utils_1.AmplifyUrl(appSyncGraphqlEndpoint).host
            : undefined;
        const resolvedApiKey = authenticationType === 'apiKey' ? apiKey : undefined;
        logger.debug(`Authenticating with ${JSON.stringify(authenticationType)}`);
        const result = await handler({
            payload,
            canonicalUri,
            appSyncGraphqlEndpoint,
            apiKey: resolvedApiKey,
            region,
            host,
            additionalCustomHeaders,
        });
        return result;
    }
};
exports.awsRealTimeHeaderBasedAuth = awsRealTimeHeaderBasedAuth;
//# sourceMappingURL=authHeaders.js.map
