'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AUTH_TOKEN_COOKIES_MAX_AGE = exports.AUTH_KEY_PREFIX = exports.createKeysForAuthStorage = exports.validateState = exports.generateCodeVerifier = exports.getRedirectUrl = exports.generateState = exports.createUserPoolsTokenProvider = exports.createAWSCredentialsAndIdentityIdProvider = exports.createKeyValueStorageFromCookieStorageAdapter = exports.runWithAmplifyServerContext = void 0;
var runWithAmplifyServerContext_1 = require("./runWithAmplifyServerContext");
Object.defineProperty(exports, "runWithAmplifyServerContext", { enumerable: true, get: function () { return runWithAmplifyServerContext_1.runWithAmplifyServerContext; } });
var storageFactories_1 = require("./storageFactories");
Object.defineProperty(exports, "createKeyValueStorageFromCookieStorageAdapter", { enumerable: true, get: function () { return storageFactories_1.createKeyValueStorageFromCookieStorageAdapter; } });
var cognito_1 = require("./authProvidersFactories/cognito");
Object.defineProperty(exports, "createAWSCredentialsAndIdentityIdProvider", { enumerable: true, get: function () { return cognito_1.createAWSCredentialsAndIdentityIdProvider; } });
Object.defineProperty(exports, "createUserPoolsTokenProvider", { enumerable: true, get: function () { return cognito_1.createUserPoolsTokenProvider; } });
var cognito_2 = require("@aws-amplify/auth/cognito");
Object.defineProperty(exports, "generateState", { enumerable: true, get: function () { return cognito_2.generateState; } });
Object.defineProperty(exports, "getRedirectUrl", { enumerable: true, get: function () { return cognito_2.getRedirectUrl; } });
Object.defineProperty(exports, "generateCodeVerifier", { enumerable: true, get: function () { return cognito_2.generateCodeVerifier; } });
Object.defineProperty(exports, "validateState", { enumerable: true, get: function () { return cognito_2.validateState; } });
Object.defineProperty(exports, "createKeysForAuthStorage", { enumerable: true, get: function () { return cognito_2.createKeysForAuthStorage; } });
Object.defineProperty(exports, "AUTH_KEY_PREFIX", { enumerable: true, get: function () { return cognito_2.AUTH_KEY_PREFIX; } });
var constants_1 = require("./constants");
Object.defineProperty(exports, "DEFAULT_AUTH_TOKEN_COOKIES_MAX_AGE", { enumerable: true, get: function () { return constants_1.DEFAULT_AUTH_TOKEN_COOKIES_MAX_AGE; } });
//# sourceMappingURL=index.js.map
