import { getAmplifyServerContext } from '@aws-amplify/core/internals/adapter-core';
import { copy as copy$1 } from '../internal/copy.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function copy(contextSpec, input) {
    return copy$1(getAmplifyServerContext(contextSpec).amplify, input);
}

export { copy };
//# sourceMappingURL=copy.mjs.map
