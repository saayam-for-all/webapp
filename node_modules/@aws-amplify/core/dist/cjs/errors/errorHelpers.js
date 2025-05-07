'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = void 0;
const types_1 = require("../types");
const createAssertionFunction_1 = require("./createAssertionFunction");
const amplifyErrorMap = {
    [types_1.AmplifyErrorCode.NoEndpointId]: {
        message: 'Endpoint ID was not found and was unable to be created.',
    },
    [types_1.AmplifyErrorCode.PlatformNotSupported]: {
        message: 'Function not supported on current platform.',
    },
    [types_1.AmplifyErrorCode.Unknown]: {
        message: 'An unknown error occurred.',
    },
    [types_1.AmplifyErrorCode.NetworkError]: {
        message: 'A network error has occurred.',
    },
};
exports.assert = (0, createAssertionFunction_1.createAssertionFunction)(amplifyErrorMap);
//# sourceMappingURL=errorHelpers.js.map
