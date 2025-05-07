'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultIdentityIdStore = void 0;
const core_1 = require("@aws-amplify/core");
const utils_1 = require("@aws-amplify/core/internals/utils");
const TokenStore_1 = require("../tokenProvider/TokenStore");
const types_1 = require("./types");
const logger = new core_1.ConsoleLogger('DefaultIdentityIdStore');
class DefaultIdentityIdStore {
    setAuthConfig(authConfigParam) {
        (0, utils_1.assertIdentityPoolIdConfig)(authConfigParam.Cognito);
        this.authConfig = authConfigParam;
        this._authKeys = createKeysForAuthStorage('Cognito', authConfigParam.Cognito.identityPoolId);
    }
    constructor(keyValueStorage) {
        this._authKeys = {};
        this._hasGuestIdentityId = false;
        this.keyValueStorage = keyValueStorage;
    }
    async loadIdentityId() {
        (0, utils_1.assertIdentityPoolIdConfig)(this.authConfig?.Cognito);
        try {
            if (this._primaryIdentityId) {
                return {
                    id: this._primaryIdentityId,
                    type: 'primary',
                };
            }
            else {
                const storedIdentityId = await this.keyValueStorage.getItem(this._authKeys.identityId);
                if (storedIdentityId) {
                    this._hasGuestIdentityId = true;
                    return {
                        id: storedIdentityId,
                        type: 'guest',
                    };
                }
                return null;
            }
        }
        catch (err) {
            logger.log('Error getting stored IdentityId.', err);
            return null;
        }
    }
    async storeIdentityId(identity) {
        (0, utils_1.assertIdentityPoolIdConfig)(this.authConfig?.Cognito);
        if (identity.type === 'guest') {
            this.keyValueStorage.setItem(this._authKeys.identityId, identity.id);
            // Clear in-memory storage of primary identityId
            this._primaryIdentityId = undefined;
            this._hasGuestIdentityId = true;
        }
        else {
            this._primaryIdentityId = identity.id;
            // Clear locally stored guest id
            if (this._hasGuestIdentityId) {
                this.keyValueStorage.removeItem(this._authKeys.identityId);
                this._hasGuestIdentityId = false;
            }
        }
    }
    async clearIdentityId() {
        this._primaryIdentityId = undefined;
        await this.keyValueStorage.removeItem(this._authKeys.identityId);
    }
}
exports.DefaultIdentityIdStore = DefaultIdentityIdStore;
const createKeysForAuthStorage = (provider, identifier) => {
    return (0, TokenStore_1.getAuthStorageKeys)(types_1.IdentityIdStorageKeys)(`com.amplify.${provider}`, identifier);
};
//# sourceMappingURL=IdentityIdStore.js.map
