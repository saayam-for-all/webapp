import { base64Decoder } from '@aws-amplify/core/internals/utils';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Converts a base64url encoded string to an ArrayBuffer
 * @param base64url - a base64url encoded string
 * @returns ArrayBuffer
 */
const convertBase64UrlToArrayBuffer = (base64url) => {
    return Uint8Array.from(base64Decoder.convert(base64url, { urlSafe: true }), x => x.charCodeAt(0)).buffer;
};

export { convertBase64UrlToArrayBuffer };
//# sourceMappingURL=convertBase64UrlToArrayBuffer.mjs.map
