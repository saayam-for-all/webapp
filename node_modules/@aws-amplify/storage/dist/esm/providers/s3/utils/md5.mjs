import { Md5 } from '@smithy/md5-js';
import '@aws-amplify/core/internals/aws-client-utils';
import './client/runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import './client/runtime/s3TransferHandler/xhr.mjs';
import { toBase64 } from './client/runtime/base64/index.native.mjs';
import '@aws-amplify/core/internals/utils';
import { readFile } from './readFile.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const calculateContentMd5 = async (content) => {
    const hasher = new Md5();
    const buffer = content instanceof Blob ? await readFile(content) : content;
    hasher.update(buffer);
    const digest = await hasher.digest();
    return toBase64(digest);
};

export { calculateContentMd5 };
//# sourceMappingURL=md5.mjs.map
