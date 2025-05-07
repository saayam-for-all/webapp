import { Buffer } from 'buffer';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function toBase64(input) {
    if (typeof input === 'string') {
        return Buffer.from(input, 'utf-8').toString('base64');
    }
    return Buffer.from(input.buffer).toString('base64');
}

export { toBase64 };
//# sourceMappingURL=index.native.mjs.map
