'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertArrayBufferToBase64Url = void 0;
const utils_1 = require("@aws-amplify/core/internals/utils");
// https://datatracker.ietf.org/doc/html/rfc4648#page-7
/**
 * Converts an ArrayBuffer to a base64url encoded string
 * @param buffer - the ArrayBuffer instance of a Uint8Array
 * @returns string - a base64url encoded string
 */
const convertArrayBufferToBase64Url = (buffer) => {
    return utils_1.base64Encoder.convert(new Uint8Array(buffer), {
        urlSafe: true,
        skipPadding: true,
    });
};
exports.convertArrayBufferToBase64Url = convertArrayBufferToBase64Url;
//# sourceMappingURL=convertArrayBufferToBase64Url.js.map
