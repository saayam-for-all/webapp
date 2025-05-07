import '@smithy/md5-js';
import '@aws-amplify/core/internals/aws-client-utils';
import '../../../utils/client/runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import '../../../utils/client/runtime/s3TransferHandler/xhr.mjs';
import 'buffer';
import '@aws-amplify/core/internals/utils';
import { assertValidationError } from '../../../../../errors/utils/assertValidationError.mjs';
import { StorageValidationErrorCode } from '../../../../../errors/types/validation.mjs';
import { MAX_OBJECT_SIZE, DEFAULT_PART_SIZE } from '../../../utils/constants.mjs';
import { createUploadTask } from '../../../utils/transferTask.mjs';
import { byteLength } from './byteLength.mjs';
import { putObjectJob } from './putObjectJob.mjs';
import { getMultipartUploadHandlers } from './multipart/uploadHandlers.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const uploadData = (input) => {
    const { data } = input;
    const dataByteLength = byteLength(data);
    // Using InvalidUploadSource error code because the input data must NOT be any
    // of permitted Blob, string, ArrayBuffer(View) if byteLength could not be determined.
    assertValidationError(dataByteLength !== undefined, StorageValidationErrorCode.InvalidUploadSource);
    assertValidationError(dataByteLength <= MAX_OBJECT_SIZE, StorageValidationErrorCode.ObjectIsTooLarge);
    if (dataByteLength <= DEFAULT_PART_SIZE) {
        // Single part upload
        const abortController = new AbortController();
        return createUploadTask({
            isMultipartUpload: false,
            job: putObjectJob(input, abortController.signal, dataByteLength),
            onCancel: (message) => {
                abortController.abort(message);
            },
        });
    }
    else {
        // Multipart upload
        const { multipartUploadJob, onPause, onResume, onCancel } = getMultipartUploadHandlers(input, dataByteLength);
        return createUploadTask({
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

export { uploadData };
//# sourceMappingURL=index.mjs.map
