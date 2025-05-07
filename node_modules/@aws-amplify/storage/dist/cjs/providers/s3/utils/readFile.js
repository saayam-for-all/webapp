'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
const readFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.onabort = () => {
        reject(new Error('Read aborted'));
    };
    reader.onerror = () => {
        reject(reader.error);
    };
    reader.readAsArrayBuffer(file);
});
exports.readFile = readFile;
//# sourceMappingURL=readFile.js.map
