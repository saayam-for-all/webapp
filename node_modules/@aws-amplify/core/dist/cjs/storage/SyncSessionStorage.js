'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncSessionStorage = void 0;
const SyncKeyValueStorage_1 = require("./SyncKeyValueStorage");
const utils_1 = require("./utils");
/**
 * @internal
 */
class SyncSessionStorage extends SyncKeyValueStorage_1.SyncKeyValueStorage {
    constructor() {
        super((0, utils_1.getSessionStorageWithFallback)());
    }
}
exports.SyncSessionStorage = SyncSessionStorage;
//# sourceMappingURL=SyncSessionStorage.js.map
