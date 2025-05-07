'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCallerAccessGrants = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
const utils_2 = require("../../utils");
const s3control_1 = require("../../providers/s3/utils/client/s3control");
const StorageError_1 = require("../../errors/StorageError");
const userAgent_1 = require("../../providers/s3/utils/userAgent");
const constants_1 = require("../utils/constants");
/**
 * @internal
 */
const listCallerAccessGrants = async (input) => {
    const { credentialsProvider, accountId, region, nextToken, pageSize, customEndpoint, } = input;
    utils_2.logger.debug(`listing available locations from account ${input.accountId}`);
    if (!!pageSize && pageSize > constants_1.MAX_PAGE_SIZE) {
        utils_2.logger.debug(`defaulting pageSize to ${constants_1.MAX_PAGE_SIZE}.`);
    }
    const clientCredentialsProvider = async (options) => {
        const { credentials } = await credentialsProvider(options);
        return credentials;
    };
    const { CallerAccessGrantsList, NextToken } = await (0, s3control_1.listCallerAccessGrants)({
        credentials: clientCredentialsProvider,
        customEndpoint,
        region,
        userAgentValue: (0, userAgent_1.getStorageUserAgentValue)(utils_1.StorageAction.ListCallerAccessGrants),
    }, {
        AccountId: accountId,
        NextToken: nextToken,
        MaxResults: pageSize ?? constants_1.MAX_PAGE_SIZE,
        AllowedByApplication: true,
    });
    const accessGrants = CallerAccessGrantsList?.map(grant => {
        assertGrantScope(grant.GrantScope);
        return {
            scope: grant.GrantScope,
            permission: grant.Permission,
            type: parseGrantType(grant.GrantScope),
        };
    }) ?? [];
    return {
        locations: accessGrants,
        nextToken: NextToken,
    };
};
exports.listCallerAccessGrants = listCallerAccessGrants;
const parseGrantType = (grantScope) => {
    const bucketScopeReg = /^s3:\/\/(.*)\/\*$/;
    const possibleBucketName = grantScope.match(bucketScopeReg)?.[1];
    if (!grantScope.endsWith('*')) {
        return 'OBJECT';
    }
    else if (grantScope.endsWith('/*') &&
        possibleBucketName &&
        possibleBucketName.indexOf('/') === -1) {
        return 'BUCKET';
    }
    else {
        return 'PREFIX';
    }
};
function assertGrantScope(value) {
    if (typeof value !== 'string' || !value.startsWith('s3://')) {
        throw new StorageError_1.StorageError({
            name: 'InvalidGrantScope',
            message: `Expected a valid grant scope, got ${value}`,
        });
    }
}
//# sourceMappingURL=listCallerAccessGrants.js.map
