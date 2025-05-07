import { AmplifyErrorCode } from '../types/errors.mjs';
import { createAssertionFunction } from './createAssertionFunction.mjs';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const amplifyErrorMap = {
    [AmplifyErrorCode.NoEndpointId]: {
        message: 'Endpoint ID was not found and was unable to be created.',
    },
    [AmplifyErrorCode.PlatformNotSupported]: {
        message: 'Function not supported on current platform.',
    },
    [AmplifyErrorCode.Unknown]: {
        message: 'An unknown error occurred.',
    },
    [AmplifyErrorCode.NetworkError]: {
        message: 'A network error has occurred.',
    },
};
const assert = createAssertionFunction(amplifyErrorMap);

export { assert };
//# sourceMappingURL=errorHelpers.mjs.map
