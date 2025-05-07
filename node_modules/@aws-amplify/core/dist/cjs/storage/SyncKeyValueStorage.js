'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncKeyValueStorage = void 0;
const errors_1 = require("../errors");
/**
 * @internal
 */
class SyncKeyValueStorage {
    constructor(storage) {
        this._storage = storage;
    }
    get storage() {
        if (!this._storage)
            throw new errors_1.PlatformNotSupportedError();
        return this._storage;
    }
    /**
     * This is used to set a specific item in storage
     * @param {string} key - the key for the item
     * @param {object} value - the value
     * @returns {string} value that was set
     */
    setItem(key, value) {
        this.storage.setItem(key, value);
    }
    /**
     * This is used to get a specific key from storage
     * @param {string} key - the key for the item
     * This is used to clear the storage
     * @returns {string} the data item
     */
    getItem(key) {
        return this.storage.getItem(key);
    }
    /**
     * This is used to remove an item from storage
     * @param {string} key - the key being set
     * @returns {string} value - value that was deleted
     */
    removeItem(key) {
        this.storage.removeItem(key);
    }
    /**
     * This is used to clear the storage
     * @returns {string} nothing
     */
    clear() {
        this.storage.clear();
    }
}
exports.SyncKeyValueStorage = SyncKeyValueStorage;
//# sourceMappingURL=SyncKeyValueStorage.js.map
