'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBase64 = exports.hexToArrayBuffer = exports.hexToUint8Array = void 0;
const runtime_1 = require("./client/runtime");
const hexToUint8Array = (hexString) => new Uint8Array((hexString.match(/\w{2}/g) ?? []).map(h => parseInt(h, 16)));
exports.hexToUint8Array = hexToUint8Array;
const hexToArrayBuffer = (hexString) => (0, exports.hexToUint8Array)(hexString).buffer;
exports.hexToArrayBuffer = hexToArrayBuffer;
const hexToBase64 = (hexString) => (0, runtime_1.toBase64)((0, exports.hexToUint8Array)(hexString));
exports.hexToBase64 = hexToBase64;
//# sourceMappingURL=hexUtils.js.map
