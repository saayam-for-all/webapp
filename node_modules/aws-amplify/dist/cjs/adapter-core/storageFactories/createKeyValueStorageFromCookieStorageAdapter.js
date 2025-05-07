'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeyValueStorageFromCookieStorageAdapter = exports.defaultSetCookieOptions = void 0;
const constants_1 = require("../constants");
exports.defaultSetCookieOptions = {
    // TODO: allow configure with a public interface
    sameSite: 'lax',
    secure: true,
    path: '/',
};
/**
 * Creates a Key Value storage interface using the `cookieStorageAdapter` as the
 * underlying storage.
 * @param cookieStorageAdapter An implementation of the `Adapter` in {@link CookieStorage}.
 * @returns An object that implements {@link KeyValueStorageInterface}.
 */
const createKeyValueStorageFromCookieStorageAdapter = (cookieStorageAdapter, validator, setCookieOptions = {}) => {
    return {
        setItem(key, value) {
            // Delete the cookie item first then set it. This results:
            // SetCookie: key=;expires=1970-01-01;(path='current-path') <- remove path'ed cookies
            // SetCookie: key=value;expires=Date.now() + 365 days;path=/;secure=true
            cookieStorageAdapter.delete(key);
            const mergedCookieOptions = {
                ...exports.defaultSetCookieOptions,
                ...setCookieOptions,
            };
            // when expires and maxAge both are not specified, we set a default maxAge
            if (!mergedCookieOptions.expires && !mergedCookieOptions.maxAge) {
                mergedCookieOptions.maxAge = constants_1.DEFAULT_AUTH_TOKEN_COOKIES_MAX_AGE;
            }
            cookieStorageAdapter.set(key, value, mergedCookieOptions);
            return Promise.resolve();
        },
        async getItem(key) {
            const cookie = cookieStorageAdapter.get(key);
            const value = cookie?.value ?? null;
            if (value && validator?.getItem) {
                const isValid = await validator.getItem(key, value);
                if (!isValid)
                    return null;
            }
            return value;
        },
        removeItem(key) {
            cookieStorageAdapter.delete(key);
            return Promise.resolve();
        },
        clear() {
            // TODO(HuiSF): follow up the implementation.
            throw new Error('This method has not implemented.');
        },
    };
};
exports.createKeyValueStorageFromCookieStorageAdapter = createKeyValueStorageFromCookieStorageAdapter;
//# sourceMappingURL=createKeyValueStorageFromCookieStorageAdapter.js.map
