import { AmplifyUrl } from '@aws-amplify/core/internals/utils';
import { post } from '@aws-amplify/api-rest/internals';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
async function graphqlRequest(amplify, url, options, abortController, _post) {
    const p = _post ?? post;
    const { body: responseBody } = await p(amplify, {
        url: new AmplifyUrl(url),
        options,
        abortController,
    });
    const response = await responseBody.json();
    return response;
}

export { graphqlRequest };
//# sourceMappingURL=graphqlRequest.mjs.map
