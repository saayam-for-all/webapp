import { PlatformNotSupportedError } from '@aws-amplify/core/internals/utils';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const getPasskey = async () => {
    throw new PlatformNotSupportedError();
};

export { getPasskey };
//# sourceMappingURL=getPasskey.native.mjs.map
