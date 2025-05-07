'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonRetryableError = void 0;
class NonRetryableError extends Error {
    constructor() {
        super(...arguments);
        this.nonRetryable = true;
    }
}
exports.NonRetryableError = NonRetryableError;
//# sourceMappingURL=NonRetryableError.js.map
