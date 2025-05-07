import { StorageAction } from '@aws-amplify/core/internals/utils';
import '../../errors/types/validation.mjs';
import { StorageError } from '../../errors/StorageError.mjs';
import { logger } from '../../utils/logger.mjs';
import '../../providers/s3/utils/client/s3control/getDataAccess.mjs';
import { listCallerAccessGrants as listCallerAccessGrants$1 } from '../../providers/s3/utils/client/s3control/listCallerAccessGrants.mjs';
import { getStorageUserAgentValue } from '../../providers/s3/utils/userAgent.mjs';
import { MAX_PAGE_SIZE } from '../utils/constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * @internal
 */
const listCallerAccessGrants = async (input) => {
    const { credentialsProvider, accountId, region, nextToken, pageSize, customEndpoint, } = input;
    logger.debug(`listing available locations from account ${input.accountId}`);
    if (!!pageSize && pageSize > MAX_PAGE_SIZE) {
        logger.debug(`defaulting pageSize to ${MAX_PAGE_SIZE}.`);
    }
    const clientCredentialsProvider = async (options) => {
        const { credentials } = await credentialsProvider(options);
        return credentials;
    };
    const { CallerAccessGrantsList, NextToken } = await listCallerAccessGrants$1({
        credentials: clientCredentialsProvider,
        customEndpoint,
        region,
        userAgentValue: getStorageUserAgentValue(StorageAction.ListCallerAccessGrants),
    }, {
        AccountId: accountId,
        NextToken: nextToken,
        MaxResults: pageSize ?? MAX_PAGE_SIZE,
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
        throw new StorageError({
            name: 'InvalidGrantScope',
            message: `Expected a valid grant scope, got ${value}`,
        });
    }
}

export { listCallerAccessGrants };
//# sourceMappingURL=listCallerAccessGrants.mjs.map
