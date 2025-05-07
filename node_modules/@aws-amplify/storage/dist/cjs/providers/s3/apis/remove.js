'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = void 0;
const core_1 = require("@aws-amplify/core");
const remove_1 = require("./internal/remove");
function remove(input) {
    return (0, remove_1.remove)(core_1.Amplify, input);
}
exports.remove = remove;
//# sourceMappingURL=remove.js.map
