'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphQLResultWithError = void 0;
const graphql_1 = require("graphql");
const createGraphQLResultWithError = (error) => {
    return {
        data: {},
        errors: [new graphql_1.GraphQLError(error.message, null, null, null, null, error)],
    };
};
exports.createGraphQLResultWithError = createGraphQLResultWithError;
//# sourceMappingURL=createGraphQLResultWithError.js.map
