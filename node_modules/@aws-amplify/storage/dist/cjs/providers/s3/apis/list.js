'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.list = void 0;
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const core_1 = require("@aws-amplify/core");
const list_1 = require("./internal/list");
function list(input) {
    return (0, list_1.list)(core_1.Amplify, input ?? {});
}
exports.list = list;
//# sourceMappingURL=list.js.map
