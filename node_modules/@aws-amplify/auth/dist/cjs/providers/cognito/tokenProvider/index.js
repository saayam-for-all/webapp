'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_KEY_PREFIX = exports.tokenOrchestrator = exports.cognitoUserPoolsTokenProvider = exports.TokenOrchestrator = exports.createKeysForAuthStorage = exports.DefaultTokenStore = exports.refreshAuthTokensWithoutDedupe = exports.refreshAuthTokens = void 0;
var refreshAuthTokens_1 = require("../utils/refreshAuthTokens");
Object.defineProperty(exports, "refreshAuthTokens", { enumerable: true, get: function () { return refreshAuthTokens_1.refreshAuthTokens; } });
Object.defineProperty(exports, "refreshAuthTokensWithoutDedupe", { enumerable: true, get: function () { return refreshAuthTokens_1.refreshAuthTokensWithoutDedupe; } });
var TokenStore_1 = require("./TokenStore");
Object.defineProperty(exports, "DefaultTokenStore", { enumerable: true, get: function () { return TokenStore_1.DefaultTokenStore; } });
Object.defineProperty(exports, "createKeysForAuthStorage", { enumerable: true, get: function () { return TokenStore_1.createKeysForAuthStorage; } });
var TokenOrchestrator_1 = require("./TokenOrchestrator");
Object.defineProperty(exports, "TokenOrchestrator", { enumerable: true, get: function () { return TokenOrchestrator_1.TokenOrchestrator; } });
var tokenProvider_1 = require("./tokenProvider");
Object.defineProperty(exports, "cognitoUserPoolsTokenProvider", { enumerable: true, get: function () { return tokenProvider_1.cognitoUserPoolsTokenProvider; } });
Object.defineProperty(exports, "tokenOrchestrator", { enumerable: true, get: function () { return tokenProvider_1.tokenOrchestrator; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "AUTH_KEY_PREFIX", { enumerable: true, get: function () { return constants_1.AUTH_KEY_PREFIX; } });
//# sourceMappingURL=index.js.map
