'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyResponseDeserializer = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const aws_client_utils_1 = require("@aws-amplify/core/internals/aws-client-utils");
const assertServiceError_1 = require("../../../../../../errors/utils/assertServiceError");
const AuthError_1 = require("../../../../../../errors/AuthError");
const createEmptyResponseDeserializer = () => async (response) => {
    if (response.statusCode >= 300) {
        const error = await (0, aws_client_utils_1.parseJsonError)(response);
        (0, assertServiceError_1.assertServiceError)(error);
        throw new AuthError_1.AuthError({ name: error.name, message: error.message });
    }
    else {
        return undefined;
    }
};
exports.createEmptyResponseDeserializer = createEmptyResponseDeserializer;
//# sourceMappingURL=createEmptyResponseDeserializer.js.map
