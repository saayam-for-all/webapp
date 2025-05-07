import JsCookie from 'js-cookie';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
class CookieStorage {
    constructor(data = {}) {
        const { path, domain, expires, sameSite, secure } = data;
        this.domain = domain;
        this.path = path || '/';
        this.expires = Object.prototype.hasOwnProperty.call(data, 'expires')
            ? expires
            : 365;
        this.secure = Object.prototype.hasOwnProperty.call(data, 'secure')
            ? secure
            : true;
        if (Object.prototype.hasOwnProperty.call(data, 'sameSite')) {
            if (!sameSite || !['strict', 'lax', 'none'].includes(sameSite)) {
                throw new Error('The sameSite value of cookieStorage must be "lax", "strict" or "none".');
            }
            if (sameSite === 'none' && !this.secure) {
                throw new Error('sameSite = None requires the Secure attribute in latest browser versions.');
            }
            this.sameSite = sameSite;
        }
    }
    async setItem(key, value) {
        JsCookie.set(key, value, this.getData());
    }
    async getItem(key) {
        const item = JsCookie.get(key);
        return item ?? null;
    }
    async removeItem(key) {
        JsCookie.remove(key, this.getData());
    }
    async clear() {
        const cookie = JsCookie.get();
        const promises = Object.keys(cookie).map(key => this.removeItem(key));
        await Promise.all(promises);
    }
    getData() {
        return {
            path: this.path,
            expires: this.expires,
            domain: this.domain,
            secure: this.secure,
            ...(this.sameSite && { sameSite: this.sameSite }),
        };
    }
}

export { CookieStorage };
//# sourceMappingURL=CookieStorage.mjs.map
