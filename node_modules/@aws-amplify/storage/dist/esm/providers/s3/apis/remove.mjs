import { Amplify } from '@aws-amplify/core';
import { remove as remove$1 } from './internal/remove.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function remove(input) {
    return remove$1(Amplify, input);
}

export { remove };
//# sourceMappingURL=remove.mjs.map
