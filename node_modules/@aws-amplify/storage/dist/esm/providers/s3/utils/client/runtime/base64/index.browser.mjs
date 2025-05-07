// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function bytesToBase64(bytes) {
    const base64Str = Array.from(bytes, x => String.fromCodePoint(x)).join('');
    return btoa(base64Str);
}
function toBase64(input) {
    if (typeof input === 'string') {
        return bytesToBase64(new TextEncoder().encode(input));
    }
    return bytesToBase64(new Uint8Array(input.buffer, input.byteOffset, input.byteLength));
}

export { toBase64 };
//# sourceMappingURL=index.browser.mjs.map
