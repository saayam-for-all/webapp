'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionStorageWithFallback = exports.getLocalStorageWithFallback = void 0;
const Logger_1 = require("../Logger");
const InMemoryStorage_1 = require("./InMemoryStorage");
/**
 * @internal
 * @returns Either a reference to window.localStorage or an in-memory storage as fallback
 */
const logger = new Logger_1.ConsoleLogger('CoreStorageUtils');
const getLocalStorageWithFallback = () => {
    try {
        // Attempt to use localStorage directly
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage;
        }
    }
    catch (e) {
        // Handle any errors related to localStorage access
        logger.info('localStorage not found. InMemoryStorage is used as a fallback.');
    }
    // Return in-memory storage as a fallback if localStorage is not accessible
    return new InMemoryStorage_1.InMemoryStorage();
};
exports.getLocalStorageWithFallback = getLocalStorageWithFallback;
/**
 * @internal
 * @returns Either a reference to window.sessionStorage or an in-memory storage as fallback
 */
const getSessionStorageWithFallback = () => {
    try {
        // Attempt to use sessionStorage directly
        if (typeof window !== 'undefined' && window.sessionStorage) {
            // Verify we can actually use it by testing access
            window.sessionStorage.getItem('test');
            return window.sessionStorage;
        }
        throw new Error('sessionStorage is not defined');
    }
    catch (e) {
        // Handle any errors related to sessionStorage access
        logger.info('sessionStorage not found. InMemoryStorage is used as a fallback.');
        return new InMemoryStorage_1.InMemoryStorage();
    }
};
exports.getSessionStorageWithFallback = getSessionStorageWithFallback;
//# sourceMappingURL=utils.js.map
