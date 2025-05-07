import { base64Encoder } from '@aws-amplify/core/internals/utils';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// https://datatracker.ietf.org/doc/html/rfc4648#page-7
/**
 * Converts an ArrayBuffer to a base64url encoded string
 * @param buffer - the ArrayBuffer instance of a Uint8Array
 * @returns string - a base64url encoded string
 */
const convertArrayBufferToBase64Url = (buffer) => {
    return base64Encoder.convert(new Uint8Array(buffer), {
        urlSafe: true,
        skipPadding: true,
    });
};

export { convertArrayBufferToBase64Url };
//# sourceMappingURL=convertArrayBufferToBase64Url.mjs.map
