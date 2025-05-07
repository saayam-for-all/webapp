'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBase64UrlToArrayBuffer = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
/**
 * Converts a base64url encoded string to an ArrayBuffer
 * @param base64url - a base64url encoded string
 * @returns ArrayBuffer
 */
const convertBase64UrlToArrayBuffer = (base64url) => {
    return Uint8Array.from(utils_1.base64Decoder.convert(base64url, { urlSafe: true }), x => x.charCodeAt(0)).buffer;
};
exports.convertBase64UrlToArrayBuffer = convertBase64UrlToArrayBuffer;
//# sourceMappingURL=convertBase64UrlToArrayBuffer.js.map
