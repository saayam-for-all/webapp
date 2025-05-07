'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfirmSignUpClient = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const constants_1 = require("./constants");
const handler_1 = require("./shared/handler");
const serde_1 = require("./shared/serde");
const createConfirmSignUpClient = (config) => (0, composers_1.composeServiceApi)(handler_1.cognitoUserPoolTransferHandler, (0, serde_1.createUserPoolSerializer)('ConfirmSignUp'), (0, serde_1.createUserPoolDeserializer)(), {
    ...constants_1.DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});
exports.createConfirmSignUpClient = createConfirmSignUpClient;
//# sourceMappingURL=createConfirmSignUpClient.js.map
