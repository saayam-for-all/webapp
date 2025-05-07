import { getRetryDecider, parseJsonError, jitteredBackoff } from '@aws-amplify/core/internals/aws-client-utils';
import { getAmplifyUserAgent } from '@aws-amplify/core/internals/utils';
import { COGNITO_IDP_SERVICE_NAME } from '../../../constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const DEFAULT_SERVICE_CLIENT_API_CONFIG = {
    service: COGNITO_IDP_SERVICE_NAME,
    retryDecider: getRetryDecider(parseJsonError),
    computeDelay: jitteredBackoff,
    userAgentValue: getAmplifyUserAgent(),
    cache: 'no-store',
};

export { DEFAULT_SERVICE_CLIENT_API_CONFIG };
//# sourceMappingURL=constants.mjs.map
