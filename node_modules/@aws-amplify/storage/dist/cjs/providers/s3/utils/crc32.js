'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateContentCRC32 = void 0;
const tslib_1 = require("tslib");
const crc_32_1 = tslib_1.__importDefault(require("crc-32"));
const hexUtils_1 = require("./hexUtils");
const readFile_1 = require("./readFile");
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
const calculateContentCRC32 = async (content, seed = 0) => {
    let internalSeed = seed;
    if (content instanceof ArrayBuffer || ArrayBuffer.isView(content)) {
        let uint8Array;
        if (content instanceof ArrayBuffer) {
            uint8Array = new Uint8Array(content);
        }
        else {
            uint8Array = new Uint8Array(content.buffer, content.byteOffset, content.byteLength);
        }
        let offset = 0;
        while (offset < uint8Array.length) {
            const end = Math.min(offset + CHUNK_SIZE, uint8Array.length);
            const chunk = uint8Array.slice(offset, end);
            internalSeed = crc_32_1.default.buf(chunk, internalSeed) >>> 0;
            offset = end;
        }
    }
    else {
        let blob;
        if (content instanceof Blob) {
            blob = content;
        }
        else {
            blob = new Blob([content]);
        }
        let offset = 0;
        while (offset < blob.size) {
            const end = Math.min(offset + CHUNK_SIZE, blob.size);
            const chunk = blob.slice(offset, end);
            const arrayBuffer = await (0, readFile_1.readFile)(chunk);
            const uint8Array = new Uint8Array(arrayBuffer);
            internalSeed = crc_32_1.default.buf(uint8Array, internalSeed) >>> 0;
            offset = end;
        }
    }
    const hex = internalSeed.toString(16).padStart(8, '0');
    return {
        checksumArrayBuffer: (0, hexUtils_1.hexToArrayBuffer)(hex),
        checksum: (0, hexUtils_1.hexToBase64)(hex),
        seed: internalSeed,
    };
};
exports.calculateContentCRC32 = calculateContentCRC32;
//# sourceMappingURL=crc32.js.map
