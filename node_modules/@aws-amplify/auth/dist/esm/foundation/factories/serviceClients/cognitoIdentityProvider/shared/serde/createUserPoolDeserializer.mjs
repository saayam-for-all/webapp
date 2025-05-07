import { parseJsonError, parseJsonBody } from '@aws-amplify/core/internals/aws-client-utils';
import { assertServiceError } from '../../../../../../errors/utils/assertServiceError.mjs';
import { AuthError } from '../../../../../../errors/AuthError.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createUserPoolDeserializer = () => async (response) => {
    if (response.statusCode >= 300) {
        const error = await parseJsonError(response);
        assertServiceError(error);
        throw new AuthError({ name: error.name, message: error.message });
    }
    return parseJsonBody(response);
};

export { createUserPoolDeserializer };
//# sourceMappingURL=createUserPoolDeserializer.mjs.map
