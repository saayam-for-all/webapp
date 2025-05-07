'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
const core_1 = require("@aws-amplify/core");
const copy_1 = require("./internal/copy");
function copy(input) {
    return (0, copy_1.copy)(core_1.Amplify, input);
}
exports.copy = copy;
//# sourceMappingURL=copy.js.map
