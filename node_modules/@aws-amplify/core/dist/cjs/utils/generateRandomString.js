'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = void 0;
const globalHelpers_1 = require("./globalHelpers");
const generateRandomString = (length) => {
    const STATE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = [];
    const randomNums = new Uint8Array(length);
    (0, globalHelpers_1.getCrypto)().getRandomValues(randomNums);
    for (const num of randomNums) {
        result.push(STATE_CHARSET[num % STATE_CHARSET.length]);
    }
    return result.join('');
};
exports.generateRandomString = generateRandomString;
//# sourceMappingURL=generateRandomString.js.map
