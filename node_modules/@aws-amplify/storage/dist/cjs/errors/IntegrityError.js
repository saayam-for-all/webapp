'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrityError = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const utils_1 = require("@aws-amplify/core/internals/utils");
const StorageError_1 = require("./StorageError");
class IntegrityError extends StorageError_1.StorageError {
    constructor(params = {
        name: utils_1.AmplifyErrorCode.Unknown,
        message: 'An unknown error has occurred.',
        recoverySuggestion: 'This may be a bug. Please reach out to library authors.',
    }) {
        super(params);
        // TODO: Delete the following 2 lines after we change the build target to >= es2015
        this.constructor = IntegrityError;
        Object.setPrototypeOf(this, IntegrityError.prototype);
    }
}
exports.IntegrityError = IntegrityError;
//# sourceMappingURL=IntegrityError.js.map
