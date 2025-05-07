'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadData = void 0;
const utils_1 = require("../../../utils");
const assertValidationError_1 = require("../../../../../errors/utils/assertValidationError");
const validation_1 = require("../../../../../errors/types/validation");
const constants_1 = require("../../../utils/constants");
const byteLength_1 = require("./byteLength");
const putObjectJob_1 = require("./putObjectJob");
const multipart_1 = require("./multipart");
const uploadData = (input) => {
    const { data } = input;
    const dataByteLength = (0, byteLength_1.byteLength)(data);
    // Using InvalidUploadSource error code because the input data must NOT be any
    // of permitted Blob, string, ArrayBuffer(View) if byteLength could not be determined.
    (0, assertValidationError_1.assertValidationError)(dataByteLength !== undefined, validation_1.StorageValidationErrorCode.InvalidUploadSource);
    (0, assertValidationError_1.assertValidationError)(dataByteLength <= constants_1.MAX_OBJECT_SIZE, validation_1.StorageValidationErrorCode.ObjectIsTooLarge);
    if (dataByteLength <= constants_1.DEFAULT_PART_SIZE) {
        // Single part upload
        const abortController = new AbortController();
        return (0, utils_1.createUploadTask)({
            isMultipartUpload: false,
            job: (0, putObjectJob_1.putObjectJob)(input, abortController.signal, dataByteLength),
            onCancel: (message) => {
                abortController.abort(message);
            },
        });
    }
    else {
        // Multipart upload
        const { multipartUploadJob, onPause, onResume, onCancel } = (0, multipart_1.getMultipartUploadHandlers)(input, dataByteLength);
        return (0, utils_1.createUploadTask)({
            isMultipartUpload: true,
            job: multipartUploadJob,
            onCancel: (message) => {
                onCancel(message);
            },
            onPause,
            onResume,
        });
    }
};
exports.uploadData = uploadData;
//# sourceMappingURL=index.js.map
