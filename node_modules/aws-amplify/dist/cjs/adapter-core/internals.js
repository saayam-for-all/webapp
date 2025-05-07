'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJWT = exports.urlSafeEncode = exports.assertTokenProviderConfig = exports.assertOAuthConfig = exports.getAmplifyServerContext = exports.AmplifyServerContextError = void 0;
var adapter_core_1 = require("@aws-amplify/core/internals/adapter-core");
Object.defineProperty(exports, "AmplifyServerContextError", { enumerable: true, get: function () { return adapter_core_1.AmplifyServerContextError; } });
Object.defineProperty(exports, "getAmplifyServerContext", { enumerable: true, get: function () { return adapter_core_1.getAmplifyServerContext; } });
var utils_1 = require("@aws-amplify/core/internals/utils");
Object.defineProperty(exports, "assertOAuthConfig", { enumerable: true, get: function () { return utils_1.assertOAuthConfig; } });
Object.defineProperty(exports, "assertTokenProviderConfig", { enumerable: true, get: function () { return utils_1.assertTokenProviderConfig; } });
Object.defineProperty(exports, "urlSafeEncode", { enumerable: true, get: function () { return utils_1.urlSafeEncode; } });
Object.defineProperty(exports, "decodeJWT", { enumerable: true, get: function () { return utils_1.decodeJWT; } });
//# sourceMappingURL=internals.js.map
