'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.cognitoUserPoolEndpointResolver = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const utils_1 = require("@aws-amplify/core/internals/utils");
const constants_1 = require("./constants");
const cognitoUserPoolEndpointResolver = ({ region, }) => ({
    url: new utils_1.AmplifyUrl(`https://${constants_1.COGNITO_IDP_SERVICE_NAME}.${region}.${(0, aws_client_utils_1.getDnsSuffix)(region)}`),
});
exports.cognitoUserPoolEndpointResolver = cognitoUserPoolEndpointResolver;
//# sourceMappingURL=cognitoUserPoolEndpointResolver.js.map
