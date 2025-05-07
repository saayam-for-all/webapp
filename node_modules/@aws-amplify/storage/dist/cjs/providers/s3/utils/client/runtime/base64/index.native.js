'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBase64 = void 0;
const buffer_1 = require("buffer");
function toBase64(input) {
    if (typeof input === 'string') {
        return buffer_1.Buffer.from(input, 'utf-8').toString('base64');
    }
    return buffer_1.Buffer.from(input.buffer).toString('base64');
}
exports.toBase64 = toBase64;
//# sourceMappingURL=index.native.js.map
