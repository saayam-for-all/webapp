import { GraphQLError } from 'graphql';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createGraphQLResultWithError = (error) => {
    return {
        data: {},
        errors: [new GraphQLError(error.message, null, null, null, null, error)],
    };
};

export { createGraphQLResultWithError };
//# sourceMappingURL=createGraphQLResultWithError.mjs.map
