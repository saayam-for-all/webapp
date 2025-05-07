import { defaultStorage } from '@aws-amplify/core';
import { uploadData as uploadData$1 } from './internal/uploadData/index.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function uploadData(input) {
    return uploadData$1({
        ...input,
        options: {
            ...input?.options,
            // This option enables caching in-progress multipart uploads.
            // It's ONLY needed for client-side API.
            resumableUploadsCache: defaultStorage,
        },
    });
}

export { uploadData };
//# sourceMappingURL=uploadData.mjs.map
