'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Encoder = void 0;
const globalHelpers_1 = require("../../globalHelpers");
const bytesToString_1 = require("./bytesToString");
exports.base64Encoder = {
    /**
     * Convert input to base64-encoded string
     * @param input - string to convert to base64
     * @param options - encoding options that can optionally produce a base64url string
     * @returns base64-encoded string
     */
    convert(input, options = {
        urlSafe: false,
        skipPadding: false,
    }) {
        const inputStr = typeof input === 'string' ? input : (0, bytesToString_1.bytesToString)(input);
        let encodedStr = (0, globalHelpers_1.getBtoa)()(inputStr);
        // urlSafe char replacement and skipPadding options conform to the base64url spec
        // https://datatracker.ietf.org/doc/html/rfc4648#section-5
        if (options.urlSafe) {
            encodedStr = encodedStr.replace(/\+/g, '-').replace(/\//g, '_');
        }
        if (options.skipPadding) {
            encodedStr = encodedStr.replace(/=/g, '');
        }
        return encodedStr;
    },
};
//# sourceMappingURL=base64Encoder.js.map
