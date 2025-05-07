'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateContentMd5 = void 0;
const md5_js_1 = require("@smithy/md5-js");
const utils_1 = require("./client/utils");
const readFile_1 = require("./readFile");
const calculateContentMd5 = async (content) => {
    const hasher = new md5_js_1.Md5();
    const buffer = content instanceof Blob ? await (0, readFile_1.readFile)(content) : content;
    hasher.update(buffer);
    const digest = await hasher.digest();
    return (0, utils_1.toBase64)(digest);
};
exports.calculateContentMd5 = calculateContentMd5;
//# sourceMappingURL=md5.js.map
