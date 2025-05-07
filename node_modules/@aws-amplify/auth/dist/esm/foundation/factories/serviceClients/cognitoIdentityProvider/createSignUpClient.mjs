import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { parseJsonError, parseJsonBody } from '@aws-amplify/core/internals/aws-client-utils';
import { validationErrorMap } from '../../../../common/AuthErrorStrings.mjs';
import { AuthError } from '../../../../errors/AuthError.mjs';
import { AuthValidationErrorCode } from '../../../../errors/types/validation.mjs';
import { assertServiceError } from '../../../../errors/utils/assertServiceError.mjs';
import { SignUpException } from '../../../../providers/cognito/types/errors.mjs';
import { createUserPoolSerializer } from './shared/serde/createUserPoolSerializer.mjs';
import { cognitoUserPoolTransferHandler } from './shared/handler/cognitoUserPoolTransferHandler.mjs';
import { DEFAULT_SERVICE_CLIENT_API_CONFIG } from './constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createSignUpClientDeserializer = () => async (response) => {
    if (response.statusCode >= 300) {
        const error = await parseJsonError(response);
        assertServiceError(error);
        if (
        // Missing Password Error
        // 1 validation error detected: Value at 'password'failed to satisfy constraint: Member must not be null
        error.name === SignUpException.InvalidParameterException &&
            /'password'/.test(error.message) &&
            /Member must not be null/.test(error.message)) {
            const name = AuthValidationErrorCode.EmptySignUpPassword;
            const { message, recoverySuggestion } = validationErrorMap[name];
            throw new AuthError({
                name,
                message,
                recoverySuggestion,
            });
        }
        throw new AuthError({ name: error.name, message: error.message });
    }
    return parseJsonBody(response);
};
const createSignUpClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer('SignUp'), createSignUpClientDeserializer(), {
    ...DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});

export { createSignUpClient, createSignUpClientDeserializer };
//# sourceMappingURL=createSignUpClient.mjs.map
