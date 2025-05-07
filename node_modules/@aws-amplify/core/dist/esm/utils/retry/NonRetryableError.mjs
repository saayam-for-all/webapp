// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class NonRetryableError extends Error {
    constructor() {
        super(...arguments);
        this.nonRetryable = true;
    }
}

export { NonRetryableError };
//# sourceMappingURL=NonRetryableError.mjs.map
