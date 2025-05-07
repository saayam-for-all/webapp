import { getAtob } from '../../globalHelpers/index.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const base64Decoder = {
    convert(input, options) {
        let inputStr = input;
        // urlSafe character replacement options conform to the base64 url spec
        // https://datatracker.ietf.org/doc/html/rfc4648#page-7
        if (options?.urlSafe) {
            inputStr = inputStr.replace(/-/g, '+').replace(/_/g, '/');
        }
        return getAtob()(inputStr);
    },
};

export { base64Decoder };
//# sourceMappingURL=base64Decoder.mjs.map
