import { getCrypto } from './globalHelpers/index.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const generateRandomString = (length) => {
    const STATE_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = [];
    const randomNums = new Uint8Array(length);
    getCrypto().getRandomValues(randomNums);
    for (const num of randomNums) {
        result.push(STATE_CHARSET[num % STATE_CHARSET.length]);
    }
    return result.join('');
};

export { generateRandomString };
//# sourceMappingURL=generateRandomString.mjs.map
