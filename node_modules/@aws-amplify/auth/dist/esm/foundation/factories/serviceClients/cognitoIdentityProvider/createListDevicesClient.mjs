import { composeServiceApi } from '@aws-amplify/core/internals/aws-client-utils/composers';
import { cognitoUserPoolTransferHandler } from './shared/handler/cognitoUserPoolTransferHandler.mjs';
import { createUserPoolSerializer } from './shared/serde/createUserPoolSerializer.mjs';
import { createUserPoolDeserializer } from './shared/serde/createUserPoolDeserializer.mjs';
import '@aws-amplify/core/internals/aws-client-utils';
import '@aws-amplify/core/internals/utils';
import { DEFAULT_SERVICE_CLIENT_API_CONFIG } from './constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const createListDevicesClient = (config) => composeServiceApi(cognitoUserPoolTransferHandler, createUserPoolSerializer('ListDevices'), createUserPoolDeserializer(), {
    ...DEFAULT_SERVICE_CLIENT_API_CONFIG,
    ...config,
});

export { createListDevicesClient };
//# sourceMappingURL=createListDevicesClient.mjs.map
