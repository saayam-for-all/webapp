'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.createSignUpClient = exports.createSignUpClientDeserializer = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const composers_1 = require("@aws-amplify/core/internals/aws-client-utils/composers");
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const AuthErrorStrings_1 = require("../../../../common/AuthErrorStrings");
const AuthError_1 = require("../../../../errors/AuthError");
const validation_1 = require("../../../../errors/types/validation");
const assertServiceError_1 = require("../../../../errors/utils/assertServiceError");
const errors_1 = require("../../../../providers/cognito/types/errors");
const serde_1 = require("./shared/serde");
const handler_1 = require("./shared/handler");
const constants_1 = require("./constants");
const createSignUpClientDeserializer = () => async (response) => {
    if (response.statusCode >= 300) {
        const error = await (0, aws_client_utils_1.parseJsonError)(response);
        (0, assertServiceError_1.assertServiceError)(error);
        if (
        // Missing Password Error
        // 1 validation error detected: Value at 'password'failed to satisfy constraint: Member must not be null
        error.name === errors_1.SignUpException.InvalidParameterException &&
            /'password'/.test(error.message) &&
            /Member must not be null/.test(error.message)) {
            const name = validation_1.AuthValidationErrorCode.EmptySignUpPassword;
            const { message, recoverySuggestion } = AuthErrorStrings_1.validationErrorMap[name];
            throw new AuthError_1.AuthError({
                name,
                message,
                recoverySuggestion,
            });
        }
        throw new AuthError_1.AuthError({ name: error.name, message: error.message });
    }
    return (0, aws_client_utils_1.parseJsonBody)(response);
};
exports.createSignUpClientDeserializer = createSignUpClientDeserializer;
const createSignUpClient = (config) => (0, composers_1.composeServiceApi)(handler_1.cognitoUserPoolTransferHandler, (0, serde_1.createUserPoolSerializer)('SignUp'), (0, exports.createSignUpClientDeserializer)(), {
    ...constants_1.DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});
exports.createSignUpClient = createSignUpClient;
//# sourceMappingURL=createSignUpClient.js.map
