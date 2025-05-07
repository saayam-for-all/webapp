'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeleteUserClient = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const handler_1 = require("./shared/handler");
const serde_1 = require("./shared/serde");
const constants_1 = require("./constants");
const createDeleteUserClient = (config) => (0, composers_1.composeServiceApi)(handler_1.cognitoUserPoolTransferHandler, (0, serde_1.createUserPoolSerializer)('DeleteUser'), (0, serde_1.createEmptyResponseDeserializer)(), {
    ...constants_1.DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});
exports.createDeleteUserClient = createDeleteUserClient;
//# sourceMappingURL=createDeleteUserClient.js.map
