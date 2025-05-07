// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isGraphQLResponseWithErrors(response) {
    if (!response) {
        return false;
    }
    const r = response;
    return Array.isArray(r.errors) && r.errors.length > 0;
}

export { isGraphQLResponseWithErrors };
//# sourceMappingURL=isGraphQLResponseWithErrors.mjs.map
