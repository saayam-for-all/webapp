import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { cognitoUserPoolTransferHandler } from './shared/handler/cognitoUserPoolTransferHandler.mjs';
import { createUserPoolSerializer } from './shared/serde/createUserPoolSerializer.mjs';
import '@aws-amplify/core/internals/aws-client-utils';
import '@aws-amplify/core/internals/utils';
import { createEmptyResponseDeserializer } from './shared/serde/createEmptyResponseDeserializer.mjs';
import { DEFAULT_SERVICE_CLIENT_API_CONFIG } from './constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createDeleteUserClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer('DeleteUser'), createEmptyResponseDeserializer(), {
    ...DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});

export { createDeleteUserClient };
//# sourceMappingURL=createDeleteUserClient.mjs.map
