import { getDnsSuffix } from '@aws-amplify/core/internals/aws-client-utils';
import { AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { COGNITO_IDP_SERVICE_NAME } from './constants.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const cognitoUserPoolEndpointResolver = ({ region, }) => ({
    url: new AmplifyUrl(`https://${COGNITO_IDP_SERVICE_NAME}.${region}.${getDnsSuffix(region)}`),
});

export { cognitoUserPoolEndpointResolver };
//# sourceMappingURL=cognitoUserPoolEndpointResolver.mjs.map
