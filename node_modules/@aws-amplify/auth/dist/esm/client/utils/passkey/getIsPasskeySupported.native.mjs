import { PlatformNotSupportedError } from '@aws-amplify/core/internals/utils';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getIsPasskeySupported = () => {
    throw new PlatformNotSupportedError();
};

export { getIsPasskeySupported };
//# sourceMappingURL=getIsPasskeySupported.native.mjs.map
