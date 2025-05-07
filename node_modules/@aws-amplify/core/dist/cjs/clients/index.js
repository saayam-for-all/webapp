'use strict';

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMemoization = exports.parseMetadata = exports.parseJsonError = exports.parseJsonBody = exports.userAgentMiddlewareFactory = exports.retryMiddlewareFactory = exports.jitteredBackoff = exports.getRetryDecider = exports.signingMiddlewareFactory = exports.extendedEncodeURIComponent = exports.EMPTY_SHA256_HASH = exports.signRequest = exports.presignUrl = exports.getHashedPayload = exports.authenticatedHandler = exports.unauthenticatedHandler = exports.fetchTransferHandler = exports.getDnsSuffix = void 0;
const tslib_1 = require("tslib");
var endpoints_1 = require("./endpoints");
Object.defineProperty(exports, "getDnsSuffix", { enumerable: true, get: function () { return endpoints_1.getDnsSuffix; } });
var fetch_1 = require("./handlers/fetch");
Object.defineProperty(exports, "fetchTransferHandler", { enumerable: true, get: function () { return fetch_1.fetchTransferHandler; } });
var unauthenticated_1 = require("./handlers/unauthenticated");
Object.defineProperty(exports, "unauthenticatedHandler", { enumerable: true, get: function () { return unauthenticated_1.unauthenticatedHandler; } });
var authenticated_1 = require("./handlers/authenticated");
Object.defineProperty(exports, "authenticatedHandler", { enumerable: true, get: function () { return authenticated_1.authenticatedHandler; } });
var signatureV4_1 = require("./middleware/signing/signer/signatureV4");
Object.defineProperty(exports, "getHashedPayload", { enumerable: true, get: function () { return signatureV4_1.getHashedPayload; } });
Object.defineProperty(exports, "presignUrl", { enumerable: true, get: function () { return signatureV4_1.presignUrl; } });
Object.defineProperty(exports, "signRequest", { enumerable: true, get: function () { return signatureV4_1.signRequest; } });
var constants_1 = require("./middleware/signing/signer/signatureV4/constants");
Object.defineProperty(exports, "EMPTY_SHA256_HASH", { enumerable: true, get: function () { return constants_1.EMPTY_HASH; } });
var extendedEncodeURIComponent_1 = require("./middleware/signing/utils/extendedEncodeURIComponent");
Object.defineProperty(exports, "extendedEncodeURIComponent", { enumerable: true, get: function () { return extendedEncodeURIComponent_1.extendedEncodeURIComponent; } });
var signing_1 = require("./middleware/signing");
Object.defineProperty(exports, "signingMiddlewareFactory", { enumerable: true, get: function () { return signing_1.signingMiddlewareFactory; } });
var retry_1 = require("./middleware/retry");
Object.defineProperty(exports, "getRetryDecider", { enumerable: true, get: function () { return retry_1.getRetryDecider; } });
Object.defineProperty(exports, "jitteredBackoff", { enumerable: true, get: function () { return retry_1.jitteredBackoff; } });
Object.defineProperty(exports, "retryMiddlewareFactory", { enumerable: true, get: function () { return retry_1.retryMiddlewareFactory; } });
var userAgent_1 = require("./middleware/userAgent");
Object.defineProperty(exports, "userAgentMiddlewareFactory", { enumerable: true, get: function () { return userAgent_1.userAgentMiddlewareFactory; } });
var serde_1 = require("./serde");
Object.defineProperty(exports, "parseJsonBody", { enumerable: true, get: function () { return serde_1.parseJsonBody; } });
Object.defineProperty(exports, "parseJsonError", { enumerable: true, get: function () { return serde_1.parseJsonError; } });
Object.defineProperty(exports, "parseMetadata", { enumerable: true, get: function () { return serde_1.parseMetadata; } });
var memoization_1 = require("./utils/memoization");
Object.defineProperty(exports, "withMemoization", { enumerable: true, get: function () { return memoization_1.withMemoization; } });
tslib_1.__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map
