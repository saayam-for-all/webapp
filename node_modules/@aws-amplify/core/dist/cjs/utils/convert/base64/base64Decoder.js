'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64Decoder = void 0;
const globalHelpers_1 = require("../../globalHelpers");
exports.base64Decoder = {
    convert(input, options) {
        let inputStr = input;
        // urlSafe character replacement options conform to the base64 url spec
        // https://datatracker.ietf.org/doc/html/rfc4648#page-7
        if (options?.urlSafe) {
            inputStr = inputStr.replace(/-/g, '+').replace(/_/g, '/');
        }
        return (0, globalHelpers_1.getAtob)()(inputStr);
    },
};
//# sourceMappingURL=base64Decoder.js.map
