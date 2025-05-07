'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadData = void 0;
const core_1 = require("@aws-amplify/core");
const uploadData_1 = require("./internal/uploadData");
function uploadData(input) {
    return (0, uploadData_1.uploadData)({
        ...input,
        options: {
            ...input?.options,
            // This option enables caching in-progress multipart uploads.
            // It's ONLY needed for client-side API.
            resumableUploadsCache: core_1.defaultStorage,
        },
    });
}
exports.uploadData = uploadData;
//# sourceMappingURL=uploadData.js.map
