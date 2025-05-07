'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SERVICE_CLIENT_API_CONFIG = void 0;
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_1 = require("@aws-amplify/core/internals/utils");
const constants_1 = require("../../../constants");
exports.DEFAULT_SERVICE_CLIENT_API_CONFIG = {
    service: constants_1.COGNITO_IDP_SERVICE_NAME,
    retryDecider: (0, aws_client_utils_1.getRetryDecider)(aws_client_utils_1.parseJsonError),
    computeDelay: aws_client_utils_1.jitteredBackoff,
    userAgentValue: (0, utils_1.getAmplifyUserAgent)(),
    cache: 'no-store',
};
//# sourceMappingURL=constants.js.map
