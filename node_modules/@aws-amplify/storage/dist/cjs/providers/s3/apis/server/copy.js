'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const adapter_core_1 = require("@aws-amplify/core/internals/adapter-core");
const copy_1 = require("../internal/copy");
function copy(contextSpec, input) {
    return (0, copy_1.copy)((0, adapter_core_1.getAmplifyServerContext)(contextSpec).amplify, input);
}
exports.copy = copy;
//# sourceMappingURL=copy.js.map
