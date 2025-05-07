// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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

export { readFile };
//# sourceMappingURL=readFile.mjs.map
