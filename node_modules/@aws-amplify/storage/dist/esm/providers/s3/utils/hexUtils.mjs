import './client/runtime/s3TransferHandler/fetch.mjs';
import 'fast-xml-parser';
import './client/runtime/s3TransferHandler/xhr.mjs';
import { toBase64 } from './client/runtime/base64/index.native.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const hexToUint8Array = (hexString) => new Uint8Array((hexString.match(/\w{2}/g) ?? []).map(h => parseInt(h, 16)));
const hexToArrayBuffer = (hexString) => hexToUint8Array(hexString).buffer;
const hexToBase64 = (hexString) => toBase64(hexToUint8Array(hexString));

export { hexToArrayBuffer, hexToBase64, hexToUint8Array };
//# sourceMappingURL=hexUtils.mjs.map
