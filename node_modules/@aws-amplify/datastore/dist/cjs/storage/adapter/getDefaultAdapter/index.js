'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const utils_1 = require("@aws-amplify/core/internals/utils");
const IndexedDBAdapter_1 = tslib_1.__importDefault(require("../IndexedDBAdapter"));
// eslint-disable-next-line import/no-named-as-default
const AsyncStorageAdapter_1 = tslib_1.__importDefault(require("../AsyncStorageAdapter"));
const getDefaultAdapter = () => {
    if ((utils_1.isBrowser && window.indexedDB) || ((0, utils_1.isWebWorker)() && self.indexedDB)) {
        return IndexedDBAdapter_1.default;
    }
    return AsyncStorageAdapter_1.default;
};
exports.default = getDefaultAdapter;
//# sourceMappingURL=index.js.map
